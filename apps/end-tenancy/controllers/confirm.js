/* eslint-disable no-underscore-dangle */

'use strict';

const _ = require('lodash');
const controllers = require('hof').controllers;
const helpers = require('hof-controllers/lib/util/helpers');

module.exports = class ConfirmController extends controllers.confirm {
  constructor(options) {
    super(options);
    this._fields = _.cloneDeep(this.options.fields);
  }

  setFields(req) {
    this.options.fields = _.pickBy(this._fields, field => {
      if (!field.useWhen || req.sessionModel.get(field.useWhen.field) === field.useWhen.value) {
        return true;
      }
      return false;
    });
  }

  get(req, res, callback) {
    this.setFields(req);
    return super.get(req, res, callback);
  }

  post(req, res, callback) {
    this.setFields(req);
    return super.post(req, res, callback);
  }

  locals(req, res) {
    const locals = super.locals(req, res);
    const rows = locals.rows;
    const loopStep = this.options.steps['/tenant-details'];
    const tenants = req.sessionModel.get(loopStep.storeKey);

    const fields = _.flatten(
      _.map(tenants, (tenant, id) =>
        _.map(
          _.pickBy(tenant, (value, field) =>
            this.options.fieldsConfig[field].includeInSummary !== false), (value, field) => ({
              field,
              value,
              step: `/tenant-details/${field}/${id}`,
              label: helpers.getTranslation(req.translate, field, true)
            }
          )
        )
      )
    );

    const section = {
      section: req.translate('pages.tenants-left.header'),
      fields
    };

    rows.splice(1, 0, section);

    return Object.assign({}, locals, {
      rows
    });
  }
};
