'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'agent-address',
  postcode: {
    url: '/postcode',
    fields: {
      postcode: '#agent-address-postcode',
      usePrevious: '#agent-address-use-previous-address'
    },
    content: {
      invalid: 'xxxxxx',
      valid: 'CR0 2EU',
      notFound: 'AA1 1AA',
      belfast: 'BT11 1AB'
    }
  },
  lookup: {
    url: '/lookup',

    fields: {
      'address-select': '#agent-address-select'
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
      address: '#agent-address'
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
