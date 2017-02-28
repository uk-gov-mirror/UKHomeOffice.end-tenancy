'use strict';

const _ = require('lodash');
const fetch = require('node-fetch');
const PostcodesModel = require('../models/postcodes');
const config = require('../../../config');

const getFields = addressKey => ({
  [`${addressKey}-postcode`]: {
    mixin: 'input-text-code',
    validate: ['required', 'postcode'],
    formatter: 'uppercase'
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
});

const getConfig = addressKey => ({
  postcode: {
    fields: [
      `${addressKey}-postcode`
    ]
  },
  lookup: {
    fields: [
      `${addressKey}-select`
    ],
    template: 'address-lookup'
  },
  address: {
    fields: [
      addressKey
    ],
    template: 'address'
  },
  manual: {
    fields: [
      addressKey
    ],
    template: 'address'
  }
});

module.exports = superclass => class extends superclass {
  constructor(options) {
    options.addressKey = options.addressKey || 'address';
    options.fields = getFields(options.addressKey);
    options.subSteps = getConfig(options.addressKey);
    super(options);
  }

  configure(req, res, callback) {
    const step = this.options.subSteps[req.params.action];
    Object.assign(req.form.options, {
      fields: _.pick(this.options.fields, step.fields)
    });
    if (step.template) {
      req.form.options.template = step.template;
    }
    super.configure(req, res, callback);
  }

  get(req, res, callback) {
    if (!req.params.action) {
      return res.redirect(`${req.url.replace(/\/$/, '')}/postcode`);
    }
    return super.get(req, res, callback);
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

  getNextStep(req, res, callback) {
    const step = super.getNextStep(req, res, callback);
    if (req.params.action === 'postcode') {
      const newPath = req.sessionModel.get(`${this.options.addressKey}-addresses`) ? '/lookup' : '/address';
      return req.url.replace('/postcode', newPath);
    }
    return step;
  }

  getValues(req, res, callback) {
    if (req.params.action === 'manual') {
      req.sessionModel.unset([
        `${this.options.addressKey}-postcode`,
        `${this.options.addressKey}-postcodeApiMeta`
      ]);
    } else if (req.params.action === 'lookup') {
      const addresses = req.sessionModel.get(`${this.options.addressKey}-addresses`);
      const formattedlist = _.map(_.map(addresses, 'formatted_address'), address => {
        address = address.split('\n').join(', ');
        return {
          value: address,
          label: address
        };
      });

      const count = `${formattedlist.length} address${formattedlist.length > 1 ? 'es' : ''}`;
      // eslint-disable-next-line max-len
      req.form.options.fields[`${this.options.addressKey}-select`].options = [{value: '-1', label: count}].concat(formattedlist);
    }
    super.getValues(req, res, callback);
  }

  locals(req, res, callback) {
    const isManual = req.params.action === 'manual';
    const locals = super.locals(req, res, callback);
    const postcode = req.sessionModel.get(`${this.options.addressKey}-postcode`);
    const section = this.options.route.replace(/^\//, '');
    return Object.assign({}, locals, {
      postcodeLabel: req.translate(`fields.${this.options.addressKey}-postcode.label`),
      postcode,
      section,
      route: this.options.route,
      postcodeApiMessageKey: isManual ?
        '' :
        (req.sessionModel.get(`${this.options.addressKey}-postcodeApiMeta`) || {}).messageKey
    });
  }

  // eslint-disable-next-line consistent-return
  process(req, res, callback) {
    if (req.params.action !== 'postcode') {
      return super.process(req, res, callback);
    }
    const postcode = req.form.values[`${this.options.addressKey}-postcode`];
    const previousPostcode = req.sessionModel.get(`${this.options.addressKey}-postcode`);
    if (!postcode
      || previousPostcode && previousPostcode === postcode) {
      return callback();
    }

    if (_.startsWith(postcode, 'BT')) {
      req.sessionModel.unset([
        `${this.options.addressKey}-postcodeApiMeta`,
        `${this.options.addressKey}-addresses`
      ]);
      return callback();
    }

    const postcodesModel = new PostcodesModel();
    postcodesModel.fetch(postcode)
      .then(data => {
        if (data.length) {
          req.sessionModel.set(`${this.options.addressKey}-addresses`, data);
        } else {
          req.sessionModel.unset(`${this.options.addressKey}-addresses`);
          req.sessionModel.set(`${this.options.addressKey}-postcodeApiMeta`, {
            messageKey: 'not-found'
          });
        }
        return callback();
      })
      .catch(err => {
        req.sessionModel.set(`${this.options.addressKey}-postcodeApiMeta`, {
          messageKey: 'cant-connect'
        });
        // eslint-disable-next-line no-console
        console.error('Postcode lookup error: ',
          `Code: ${err.status}; Detail: ${err.detail}`);
        return callback();
      });
  }

  saveValues(req, res, callback) {
    if (req.params.action === 'lookup') {
      const addressLines = req.form.values[`${this.options.addressKey}-select`].split(', ').join('\n');
      req.sessionModel.set(this.options.addressKey, addressLines);
    }
    super.saveValues(req, res, callback);
  }

  // eslint-disable-next-line consistent-return
  validate(req, res, callback) {
    if (req.params.action === 'postcode' && this.options.countries) {
      const field = `${this.options.addressKey}-postcode`;
      const postcode = encodeURIComponent(req.form.values[field]);
      fetch(`${config.postcode.hostname}/postcodes/${postcode}`, {
        headers: {
          Authorization: config.postcode.authorization || ''
        }
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return callback();
      })
      .then(json => {
        if (json && json.country && json.country.name) {
          let countries = this.options.countries;
          if (!Array.isArray(this.options.countries)) {
            countries = [countries].map(country => country.toLowerCase());
          }
          if (countries.indexOf(json.country.name.toLowerCase()) === -1) {
            return callback({
              [field]: new this.ValidationError(field, {
                key: `${this.options.addressKey}-postcode`,
                type: 'country',
                redirect: undefined
              }, req, res)
            });
          }
        }
        return callback();
      })
      .catch(err => {
        callback(err);
      });
    } else {
      return super.validate(req, res, callback);
    }
  }

  // eslint-disable-next-line consistent-return
  validateField(key, req) {
    const field = `${this.options.addressKey}-select`;
    if (req.params.action === 'lookup' && req.form.values[key] === '-1') {
      return new this.ValidationError(field, {
        key: field,
        type: 'required',
        redirect: undefined
      });
    }
    return super.validateField(key, req);
  }
};
