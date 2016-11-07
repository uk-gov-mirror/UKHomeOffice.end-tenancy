'use strict';

const _ = require('lodash');
const BaseController = require('hof').controllers.base;
const ErrorController = require('hof').controllers.error;
const PostcodesModel = require('../models/postcodes');
const dataValidator = require('hmpo-form-controller/lib/validation');
const dataFormatter = require('hmpo-form-controller/lib/formatting');
const mixins = require('hmpo-template-mixins');

module.exports = class AddressLookup extends BaseController {

  constructor(options) {
    super(options);
    this.addressKey = options.addressKey || 'address';
    this.fields = this.getBaseFields();
    this.use(mixins(this.fields));
  }

  getBaseFields() {
    const addressKey = this.addressKey;
    return {
      [`${addressKey}-postcode`]: {
        mixin: 'input-text-code',
        validate: ['required', 'postcode'],
        formatter: 'uppercase'
      },
      [`${addressKey}-use-previous-address`]: {
        mixin: 'checkbox'
      },
      [`${addressKey}-select`]: {
        mixin: 'select'
      },
      [addressKey]: {
        mixin: 'textarea',
        validate: 'required',
        'ignore-defaults': true,
        formatter: ['trim', 'hyphens'],
        attributes: [{
          attribute: 'rows',
          value: 6
        }]
      }
    };
  }

  get(req, res, callback) {
    if (!req.params.action) {
      return res.redirect(`${req.url.replace(/\/$/, '')}/postcode`);
    }
    this.options.template = this.getTemplate(req);
    this.options.fields = this.getFields(req);
    this.validator = dataValidator(this.options.fields);
    this.formatter = dataFormatter(this.options.fields, this.options.defaultFormatters);
    return super.get(req, res, callback);
  }

  getFields(req) {
    const addressKey = this.addressKey;
    if (req.params.action === 'postcode') {
      const pickFields = [`${addressKey}-postcode`];
      if (this.options.previousAddress) {
        pickFields.push(`${addressKey}-use-previous-address`);
      }
      return _.pick(this.fields, pickFields);
    } else if (req.params.action === 'lookup') {
      const field = `${addressKey}-select`;
      const obj = _.pick(this.fields, field);
      delete obj[field].validate;
      delete obj[field].options;
      return obj;
    }
    return _.pick(this.fields, this.addressKey);
  }

  getBackLink(req, res, callback) {
    const backLink = super.getBackLink(req, res, callback);
    switch (req.params.action) {
      case 'manual':
      case 'lookup':
        return req.url.replace(`/${req.params.action}`, '/postcode');
      case 'address':
        return req.url.replace('/address', '/lookup');
      case 'lookup':
        return req.url.replace('/lookup', '/postcode');
      default:
        return backLink;
    }
  }

  getTemplate(req) {
    switch (req.params.action) {
      case 'lookup':
        return 'address-lookup';
      case 'address':
      case 'manual':
        return 'address';
      default:
        return 'step';
    }
  }

  getNextStep(req, res, callback) {
    const step = super.getNextStep(req, res, callback);
    if (req.params.action === 'postcode' &&
      (!this.options.previousAddress ||
        req.form.values[`${this.addressKey}-use-previous-address`] !== 'true')
    ) {
      const newPath = req.sessionModel.get(`${this.addressKey}-addresses`) ? '/lookup' : '/address';
      return req.url.replace('/postcode', newPath);
    } else if (req.params.action === 'lookup') {
      return req.url.replace('/lookup', '/address');
    }
    return step;
  }

  getValues(req, res, callback) {
    if (req.params.action === 'manual') {
      req.sessionModel.unset([
        `${this.addressKey}-postcode`,
        `${this.addressKey}-postcodeApiMeta`
      ]);
    } else if (req.params.action === 'lookup') {
      const addresses = req.sessionModel.get(`${this.addressKey}-addresses`);
      const formattedlist = _.map(_.map(addresses, 'formatted_address'), address => {
        address = address.split('\n').join(', ');
        return {
          value: address,
          label: address
        };
      });

      const count = `${formattedlist.length} addresses`;
      this.options.fields[`${this.addressKey}-select`].options = [{value: count, label: count}].concat(formattedlist);
    }
    super.getValues(req, res, callback);
  }

  locals(req, res, callback) {
    const isManual = req.params.action === 'manual';
    const locals = super.locals(req, res, callback);
    const postcode = req.sessionModel.get(`${this.addressKey}-postcode`);
    const section = this.options.route.replace(/^\//, '');
    return Object.assign({}, locals, {
      postcodeLabel: req.translate(`fields.${this.addressKey}-postcode.label`),
      postcode,
      section,
      route: this.options.route,
      postcodeApiMessageKey: isManual ?
        '' :
        (req.sessionModel.get(`${this.addressKey}-postcodeApiMeta`) || {}).messageKey
    });
  }

  // eslint-disable-next-line consistent-return
  process(req, res, callback) {
    if (req.params.action !== 'postcode') {
      return super.process(req, res, callback);
    } else if (this.options.previousAddress && req.form.values[`${this.addressKey}-use-previous-address`] === 'true') {
      req.sessionModel.set(this.addressKey, req.sessionModel.get(this.options.previousAddress));
      return this.successHandler(req, res);
    }
    const postcode = req.form.values[`${this.addressKey}-postcode`];
    const previousPostcode = req.sessionModel.get(`${this.addressKey}-postcode`);
    if (!postcode
      || previousPostcode && previousPostcode === postcode) {
      return callback();
    }

    if (_.startsWith(postcode, 'BT')) {
      req.sessionModel.unset([
        `${this.addressKey}-postcodeApiMeta`,
        `${this.addressKey}-addresses`
      ]);
      return callback();
    }

    const postcodesModel = new PostcodesModel();
    postcodesModel.fetch(postcode)
      .then(data => {
        if (data.length) {
          req.sessionModel.set(`${this.addressKey}-addresses`, data);
        } else {
          req.sessionModel.unset(`${this.addressKey}-addresses`);
          req.sessionModel.set(`${this.addressKey}-postcodeApiMeta`, {
            messageKey: 'not-found'
          });
        }
        return callback();
      })
      .catch(err => {
        req.sessionModel.set(`${this.addressKey}-postcodeApiMeta`, {
          messageKey: 'cant-connect'
        });
        // eslint-disable-next-line no-console
        console.error('Postcode lookup error: ',
          `Code: ${err.status}; Detail: ${err.detail}`);
        return callback();
      });
  }

  post(req, res, cb) {
    if (req.params.action === 'lookup') {
      this.getValues(req, res, () => {});
    }
    super.post(req, res, cb);
  }

  saveValues(req, res, callback) {
    if (req.params.action === 'lookup') {
      const addressLines = req.form.values[`${this.addressKey}-select`].split(', ').join('\n');
      req.sessionModel.set(this.addressKey, addressLines);
    }
    super.saveValues(req, res, callback);
  }

  // eslint-disable-next-line consistent-return
  validateField(key, req) {
    const field = `${this.addressKey}-select`;
    if (req.params.action === 'lookup' &&
      req.form.values[key] === this.options.fields[field].options[0].value
    ) {
      return new ErrorController(field, {
        key: field,
        type: 'required',
        redirect: undefined
      });
    }
    return super.validateField(key, req);
  }
};
