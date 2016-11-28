'use strict';

let I;

const translations = require('../../translations/en/default').pages['property-address'].header;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'property-address',
  postcode: {
    url: '/postcode',
    fields: {
      postcode: '#property-address-postcode'
    },
    content: {
      check: translations.default,
      report: translations.what.report,
      invalid: '12345',
      valid: 'CR0 2EU',
      notFound: 'AA11 1AA',
      belfast: 'BT11 1AB',
      welsh: 'CH5 1AB'
    }
  },
  lookup: {
    url: '/lookup',

    fields: {
      'address-select': '#property-address-select'
    },

    content: {
      'address-select': '49 Sydenham Road, Croydon, CR0 2EU'
    }
  },
  address: {
    url: '/address',
    failedMessage: '.alert-info',
    content: '49 Sydenham Road\nCroydon\nCR0 2EU'
  },
  manual: {
    url: '/manual',
    fields: {
      address: '#property-address'
    }
  },

  links: {
    'change-postcode': '.change-postcode',
    'cant-find': '.cant-find'
  },

  enterValidPostcode() {
    I.fillField(this.postcode.fields.postcode, this.postcode.content.valid);
    I.submitForm();
  },

  selectAddressAndSubmit() {
    this.enterValidPostcode();
    I.selectOption(this.lookup.fields['address-select'], this.lookup.content['address-select']);
    I.submitForm();
  }
};
