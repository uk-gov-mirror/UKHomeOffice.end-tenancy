'use strict';

const _ = require('lodash');
const BaseController = require('hof').controllers.base;
const ErrorController = require('hof').controllers.error;
const PostcodesModel = require('../models/postcodes');
const dataValidator = require('hmpo-form-controller/lib/validation');
const dataFormatter = require('hmpo-form-controller/lib/formatting');
const mixins = require('hmpo-template-mixins');

const fields = {
  postcode: {
    mixin: 'input-text-code',
    validate: ['required', 'postcode'],
    formatter: 'uppercase'
  },
  'address-select': {},
  address: {
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

module.exports = class AddressLookup extends BaseController {
  constructor(options) {
    super(options);
    this.use(mixins(fields));
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
    if (req.params.action === 'postcode') {
      return _.pick(fields, 'postcode');
    } else if (req.params.action === 'lookup') {
      return _.pick(fields, 'address-select');
    }
    return {
      [this.options.addressField]: fields.address
    };
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
    if (req.params.action === 'postcode') {
      const newPath = req.sessionModel.get('addresses') ? '/lookup' : '/address';
      return req.url.replace('/postcode', newPath);
    } else if (req.params.action === 'lookup') {
      return req.url.replace('/lookup', '/address');
    }
    return step;
  }

  getValues(req, res, callback) {
    if (req.params.action === 'manual') {
      req.sessionModel.unset([
        'postcode',
        'postcodeApiMeta'
      ]);
    } else if (req.params.action === 'lookup') {
      const addresses = req.sessionModel.get('addresses');
      const formattedlist = _.map(_.map(addresses, 'formatted_address'), address => {
        address = address.split('\n').join(', ');
        return {
          value: address,
          label: address
        };
      });

      const count = `${formattedlist.length} addresses`;
      this.options.fields['address-select'].options = [{value: count, label: count}].concat(formattedlist);
    }
    super.getValues(req, res, callback);
  }

  locals(req, res, callback) {
    const isManual = req.params.action === 'manual';
    const locals = super.locals(req, res, callback);
    const postcode = req.sessionModel.get('postcode');
    const section = 'address-lookup';
    return Object.assign({}, locals, {
      postcode,
      section,
      postcodeApiMessageKey: isManual ? '' : (req.sessionModel.get('postcodeApiMeta') || {}).messageKey
    });
  }

  // eslint-disable-next-line consistent-return
  process(req, res, callback) {
    if (req.params.action !== 'postcode') {
      return super.process(req, res, callback);
    }
    const postcode = req.form.values.postcode;
    const previousPostcode = req.sessionModel.get('postcode');
    if (!postcode
      || previousPostcode && previousPostcode === postcode) {
      return callback();
    }

    if (_.startsWith(postcode, 'BT')) {
      req.sessionModel.unset('postcodeApiMeta');
      req.sessionModel.unset('addresses');
      return callback();
    }

    const postcodesModel = new PostcodesModel();
    postcodesModel.fetch(postcode)
      .then(data => {
        if (data.length) {
          req.sessionModel.set('addresses', data);
        } else {
          req.sessionModel.unset('addresses');
          req.sessionModel.set('postcodeApiMeta', {
            messageKey: 'not-found'
          });
        }
        return callback();
      })
      .catch(err => {
        req.sessionModel.set('postcodeApiMeta', {
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
      const addressLines = req.form.values['address-select'].split(', ').join('\n');
      req.sessionModel.set('address', addressLines);
    }
    super.saveValues(req, res, callback);
  }

  // eslint-disable-next-line consistent-return
  validateField(key, req) {
    if (req.params.action === 'lookup' &&
      req.form.values[key] === this.options.fields['address-select'].options[0].value
    ) {
      return new ErrorController('address-select', {
        key: 'address-select',
        type: 'required',
        redirect: undefined
      });
    }
    return super.validateField(key, req);
  }
};
