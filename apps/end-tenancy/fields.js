'use strict';

const dateComponent = require('hof').components.date;

module.exports = {
  what: {
    mixin: 'radio-group',
    validate: 'required',
    isPageHeading: true,
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
    }],
    appendToChangeLink: true
  },
  'nldp-date': dateComponent('nldp-date', {
    isPageHeading: true,
    mixin: 'input-date',
    validate: ['required', 'date', 'before', {type: 'after', arguments: '1900-01-01'}],
    appendToChangeLink: 'day'
  }),
  'tenancy-start': dateComponent('tenancy-start', {
    isPageHeading: 'true',
    labelClassName: 'visuallyhidden',
    validate: ['required', 'date', 'before', {type: 'after', arguments: '1900-01-01'}],
    mixin: 'input-date',
    appendToChangeLink: 'day'
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
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    autocomplete: 'address-level2'
  },
  postcode: {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    className: ['govuk-input', 'govuk-input--width-10'],
    autocomplete: 'postal-code'
  },
  name: {
    mixin: 'input-text',
    validate: ['required', 'notUrl']
  },
  'date-left': dateComponent('date-left', {
    labelClassName: 'visuallyhidden',
    mixin: 'input-date',
    validate: ['required', 'date', 'before', {type: 'after', arguments: '1900-01-01'}],
    appendToChangeLink: 'day'
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
    mixin: 'input-date',
    validate: ['required', 'date', 'before', {type: 'after', arguments: '1900-01-01'}],
    validationLink: {
      field: 'tenant-details',
      value: 'date-of-birth'
    },
    appendToChangeLink: 'day'
  }),
  nationality: {
    disableRender: true,
    validate: 'required',
    validationLink: {
      field: 'tenant-details',
      value: 'nationality'
    },
    className: ['typeahead', 'js-hidden'],
    options: [''].concat(require('hof').utils.countries())
  },
  'reference-number': {
    disableRender: true,
    validate: ['required', 'notUrl'],
    validationLink: {
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
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    autocomplete: 'address-level2'
  },
  'landlord-postcode': {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    className: ['govuk-input', 'govuk-input--width-10'],
    autocomplete: 'postal-code'
  },
  who: {
    mixin: 'radio-group',
    isPageHeading: true,
    validate: 'required',
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
    isPageHeading: true,
    validate: ['required', 'notUrl']
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
    className: ['govuk-input govuk-input--width-20'],
    validate: ['required', 'notUrl', 'internationalPhoneNumber']
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
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    autocomplete: 'address-level2'
  },
  'agent-postcode': {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    className: ['govuk-input', 'govuk-input--width-10'],
    autocomplete: 'postal-code'
  },
  'agent-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'agent-phone-number': {
    mixin: 'input-text',
    className: ['govuk-input govuk-input--width-20'],
    validate: ['required', 'notUrl', 'internationalPhoneNumber']
  },
  'declaration-identity': {
    mixin: 'checkbox',
    validate: 'required'
  },
  declaration: {
    mixin: 'checkbox',
    validate: 'required'
  }
};
