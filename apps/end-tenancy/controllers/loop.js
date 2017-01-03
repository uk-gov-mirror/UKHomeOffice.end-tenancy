/* eslint-disable no-underscore-dangle */

'use strict';

const _ = require('lodash');
const Hogan = require('hogan.js');
const controllers = require('hof-controllers');
const DateController = controllers.date;
const BaseController = controllers.base;

function hoganRender(input, ctx) {
  if (input) {
    return Hogan.compile(input).render(ctx);
  }
  return undefined;
}

function conditionalTranslate(key, t) {
  const result = t(key);
  if (result !== key) {
    return result;
  }
  return undefined;
}

module.exports = class LoopController extends DateController {

  constructor(options) {
    super(options);
    this._template = this.options.template;
    this._fields = _.cloneDeep(this.options.fields);
    this.options.storeKey = this.options.storeKey || 'items';
  }

  stepIncluded(step) {
    return Object.keys(this.options.subSteps).indexOf(step) > -1;
  }

  getStep(req) {
    return this.options.subSteps[req.params.action];
  }

  redirectTo(step, req, res) {
    return res.redirect(`${req.baseUrl.replace(/\/$/, '')}${this.options.route.replace(/\/$/, '')}/${step}`);
  }

  prereqsSatisfied(req) {
    const step = this.getStep(req);
    let prereqs = step.prereqs;
    if (!step.prereqs) {
      return true;
    }
    if (!Array.isArray(prereqs)) {
      prereqs = [prereqs];
    }
    return prereqs.every(prereq => req.sessionModel.get(prereq) !== undefined);
  }

  editing(req) {
    return req.params.edit === 'edit' || req.params.edit === 'change';
  }

  hasItems(req) {
    return _.size(req.sessionModel.get(this.options.storeKey));
  }

  get(req, res, callback) {
    if (!req.params.action ||
      !this.stepIncluded(req.params.action) ||
      (!this.prereqsSatisfied(req) && !this.editing(req))
    ) {
      const step = this.hasItems(req) ?
        _.findKey(this.options.subSteps, s => !s.next) :
        this.options.firstStep;
      return this.redirectTo(step, req, res);
    }
    if (req.params.edit === 'delete' && req.params.id) {
      return this.removeItem(req, res);
    }
    this.setDateKey(req);
    this.options.fields = this.getFields(req);
    this.options.template = this.getTemplate(req);
    return super.get(req, res, callback);
  }

  setDateKey(req) {
    const step = this.options.subSteps[req.params.action];
    if (step.dateKey) {
      this.dateKey = step.dateKey;
    }
  }

  removeItem(req, res) {
    const items = req.sessionModel.get(this.options.storeKey);
    req.sessionModel.set(this.options.storeKey, _.omit(items, req.params.id));
    const steps = Object.keys(this.options.subSteps);
    const step = _.size(items) > 1 ? steps[steps.length - 1] : steps[0];
    return res.redirect(`${req.baseUrl}${this.options.route}/${step}`);
  }

  post(req, res, callback) {
    this.options.fields = this.getFields(req);
    this.setDateKey(req);
    return super.post(req, res, callback);
  }

  getTemplate(req) {
    const step = this.getStep(req);
    if (step.template) {
      return step.template;
    }
    return this._template;
  }

  getItems(req) {
    return req.sessionModel.get(this.options.storeKey) || {};
  }

  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      if (req.params.id !== undefined) {
        const items = this.getItems(req);
        values = Object.assign({}, values, items[req.params.id] || {});
      }
      return callback(err, values);
    });
  }

  getNextStep(req, res) {
    if (req.params.edit === 'edit') {
      return this.confirmStep;
    }

    const stepName = req.params.action;
    const loopCondition = this.options.loopCondition;
    const next = this.getNext(req, res);
    const last = _.findKey(this.options.subSteps, step => !step.next);

    if (req.params.edit === 'change') {
      const re = new RegExp(`(${this.options.route}/)${req.params.action}.*`);
      return req.url.replace(re, `$1${last}`);
    }

    if (stepName !== last) {
      const re = new RegExp(`${stepName}$`);
      return req.url.replace(re, next);
    } else if (loopCondition && req.form.values[loopCondition.field] === loopCondition.value) {
      return req.url.replace(stepName, this.options.firstStep).replace(req.params.id, '');
    }
    return super.getNextStep(req, res);
  }

  getNext(req, res) {
    const step = this.getStep(req);
    step.forks = step.forks || [];
    return super.getForkTarget.call(new BaseController(step), req, res);
  }

  getFields(req) {
    const step = this.getStep(req);
    return _.pick(this._fields, step.fields);
  }

  saveValues(req, res, callback) {
    const steps = Object.keys(this.options.subSteps);
    if (req.params.id) {
      const items = this.getItems(req);
      Object.keys(req.form.values).forEach(field => {
        if (req.form.values[field]) {
          items[req.params.id][field] = req.form.values[field];
        } else {
          delete items[req.params.id][field];
        }
      });
      req.sessionModel.set(this.options.storeKey, items);
      return callback();
    }
    if (this.getNext(req, res) === steps[steps.length - 1]) {
      return super.saveValues(req, res, (err) => {
        if (err) {
          return callback(err);
        }
        const items = req.sessionModel.get(this.options.storeKey) || {};
        let id = req.params.id;
        if (id === undefined) {
          id = parseInt(req.sessionModel.get(`${this.options.storeKey}-id`) || 0, 10);
          req.sessionModel.set(`${this.options.storeKey}-id`, id + 1);
        }
        items[id] = Object.keys(this._fields).reduce((obj, field) => {
          const value = req.sessionModel.get(field);
          if (value !== '') {
            return Object.assign(obj, {
              [field]: value
            });
          }
          return obj;
        }, {});
        req.sessionModel.set(this.options.storeKey, items);
        req.sessionModel.unset(Object.keys(this._fields));
        return callback();
      });
    }
    if (steps.indexOf(req.params.action) === steps.length - 1) {
      return callback();
    }
    return super.saveValues(req, res, callback);
  }

  locals(req, res) {
    const locals = super.locals(req, res);
    const pagePath = `${locals.route}-${req.params.action}`;
    let items = req.sessionModel.get(this.options.storeKey);

    const fields = _.reduce(items, (arr, item) =>
      _.uniq(
        arr.concat(
          Object.keys(item).filter(field =>
            this._fields[field].includeInSummary !== false
          )
        )
      )
    , []);

    const headers = fields.map(field => req.translate(`fields.${field}.summary`));

    items = _.map(items, (item, id) => ({
      id,
      fields: _.map(fields, field => ({
        field,
        subroute: _.findKey(this.options.subSteps, subStep => subStep.fields.indexOf(field) > -1),
        editText: item[field] ?
          `${req.translate('buttons.edit')} ${req.translate(`fields.${field}.summary`).toLowerCase()}` :
          '',
        value: item[field]
      }))
    }));

    const title = hoganRender(conditionalTranslate(`pages.${pagePath}.header`, req.translate),
      Object.assign({}, res.locals, {
        next: items.length ? 'next ' : null
      })
    );
    const intro = items.length > 0 ?
      undefined :
      hoganRender(conditionalTranslate(`pages.${pagePath}.intro`, req.translate), res.locals);

    return Object.assign({}, locals, {
      title,
      headers,
      intro,
      items,
      summaryTitle: req.translate('pages.tenant-details.summary-title'),
      hasItems: items.length
    });
  }
};
