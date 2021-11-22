'use strict';

const dateComponent = require('hof').components.date;

module.exports = {
  what: {
    mixin: 'radio-group',
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'request',
      toggle: 'request-toggle-content',
      child: 'partials/panel'
    }, {
      value: 'check',
      toggle: 'check-toggle-content',
      child: 'partials/panel'
    }, {
      value: 'report',
      toggle: 'report-toggle-content',
      child: 'partials/panel'
    }]
  },
  'nldp-date': dateComponent('nldp-date', {
    labelClassName: 'visuallyhidden',
    validate: ['required', 'date', 'before']
  }),
  'tenancy-start': dateComponent('tenancy-start', {
    labelClassName: 'visuallyhidden',
    validate: ['required', 'date', 'before']
  }),
  building: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }],
    autocomplete: 'address-line1'
  },
  street: {
    validate: ['notUrl', { type: 'maxlength', arguments: 50 }],
    labelClassName: 'visuallyhidden',
    autocomplete: 'address-line2'
  },
  townOrCity: {
    validate: ['required', 'notUrl',
      { type: 'regex', arguments: /^([^0-9]*)$/ },
      { type: 'maxlength', arguments: 100 }
    ],
    autocomplete: 'address-level2'
  },
  postcode: {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    autocomplete: 'postal-code'
  },
  name: {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'date-left': dateComponent('date-left', {
    labelClassName: 'visuallyhidden',
    validate: ['required', 'date', 'before']
  }),
  'tenant-details': {
    mixin: 'checkbox-group',
    omitFromSummary: true,
    options: [{
      value: 'date-of-birth',
      child: 'html',
      toggle: 'date-of-birth'
    }, {
      value: 'nationality',
      child: 'select',
      toggle: 'nationality'
    }, {
      value: 'reference-number',
      child: 'input-text',
      toggle: 'reference-number'
    }]
  },
  'date-of-birth': dateComponent('date-of-birth', {
    disableRender: true,
    labelClassName: 'visuallyhidden',
    validate: ['required', 'date', 'before', {type: 'after', arguments: '1900-01-01'}],
    dependent: {
      field: 'tenant-details',
      value: 'date-of-birth'
    }
  }),
  nationality: {
    disableRender: true,
    validate: 'required',
    className: ['typeahead', 'js-hidden'],
    options: [''].concat(require('hof').utils.countries()),
    dependent: {
      field: 'tenant-details',
      value: 'nationality'
    }
  },
  'reference-number': {
    disableRender: true,
    validate: ['required', 'notUrl'],
    dependent: {
      field: 'tenant-details',
      value: 'reference-number'
    }
  },
  'add-another': {
    mixin: 'radio-group',
    legend: {
      className: 'visuallyhidden'
    },
    validate: 'required',
    options: [
      'yes',
      'no'
    ]
  },
  'landlord-building': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }],
    autocomplete: 'address-line1'
  },
  'landlord-street': {
    validate: ['notUrl', { type: 'maxlength', arguments: 50 }],
    labelClassName: 'visuallyhidden',
    autocomplete: 'address-line2'
  },
  'landlord-townOrCity': {
    validate: ['required', 'notUrl',
      { type: 'regex', arguments: /^([^0-9]*)$/ },
      { type: 'maxlength', arguments: 100 }
    ],
    autocomplete: 'address-level2'
  },
  'landlord-postcode': {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    autocomplete: 'postal-code'
  },
  who: {
    mixin: 'radio-group',
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    },
    options: [
      'landlord',
      'agent'
    ]
  },
  'landlord-name': {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'landlord-name-agent': {
    mixin: 'input-text',
    validate: ['required', 'notUrl'],
    labelClassName: 'visuallyhidden'
  },
  'landlord-company': {
    mixin: 'input-text',
    validate: ['notUrl']
  },
  'landlord-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'landlord-phone-number': {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'agent-company': {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'agent-name': {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'agent-building': {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }],
    autocomplete: 'address-line1'
  },
  'agent-street': {
    validate: ['notUrl', { type: 'maxlength', arguments: 50 }],
    labelClassName: 'visuallyhidden',
    autocomplete: 'address-line2'
  },
  'agent-townOrCity': {
    validate: ['required', 'notUrl',
      { type: 'regex', arguments: /^([^0-9]*)$/ },
      { type: 'maxlength', arguments: 100 }
    ],
    autocomplete: 'address-level2'
  },
  'agent-postcode': {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    autocomplete: 'postal-code'
  },
  'agent-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'agent-phone-number': {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'declaration-identity': {
    mixin: 'checkbox',
    validate: 'required',
    className: 'label'
  },
  declaration: {
    mixin: 'checkbox',
    validate: 'required',
    className: 'label'
  }
};
