'use strict';

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
  'nldp-date': {
    labelClassName: 'visuallyhidden'
  },
  'nldp-date-day': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'nldp-date-month': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'nldp-date-year': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'tenancy-start': {
    labelClassName: 'visuallyhidden'
  },
  'tenancy-start-day': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'tenancy-start-month': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'tenancy-start-year': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'property-address': {},
  name: {
    mixin: 'input-text',
    validate: 'required'
  },
  'date-left': {
    labelClassName: 'visuallyhidden'
  },
  'date-left-day': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'date-left-month': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'date-left-year': {
    validate: ['required', 'numeric'],
    includeInSummary: false
  },
  'tenant-details': {
    mixin: 'checkbox-group',
    options: [{
      value: 'date-of-birth',
      child: 'partials/date-of-birth',
      toggle: 'date-of-birth-toggle-content'
    }, {
      value: 'nationality',
      child: 'select',
      toggle: 'nationality'
    }, {
      value: 'reference-number',
      child: 'input-text',
      toggle: 'reference-number'
    }],
    includeInSummary: false
  },
  'date-of-birth': {
    labelClassName: 'visuallyhidden',
    validate: 'required',
    dependent: {
      field: 'tenant-details',
      value: 'date-of-birth'
    }
  },
  'date-of-birth-day': {
    validate: ['required', 'numeric'],
    includeInSummary: false,
    dependent: {
      field: 'tenant-details',
      value: 'date-of-birth'
    }
  },
  'date-of-birth-month': {
    validate: ['required', 'numeric'],
    includeInSummary: false,
    dependent: {
      field: 'tenant-details',
      value: 'date-of-birth'
    }
  },
  'date-of-birth-year': {
    validate: ['required', 'numeric'],
    includeInSummary: false,
    dependent: {
      field: 'tenant-details',
      value: 'date-of-birth'
    }
  },
  nationality: {
    validate: 'required',
    className: ['typeahead', 'js-hidden'],
    options: [''].concat(require('homeoffice-countries').allCountries),
    dependent: {
      field: 'tenant-details',
      value: 'nationality'
    }
  },
  'reference-number': {
    validate: 'required',
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
    ],
    includeInSummary: false
  },
  'landlord-address': {},
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
    validate: 'required'
  },
  'landlord-name-agent': {
    mixin: 'input-text',
    validate: 'required',
    labelClassName: 'visuallyhidden'
  },
  'landlord-company': {
    mixin: 'input-text'
  },
  'landlord-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'landlord-phone-number': {
    mixin: 'input-text',
    validate: ['required']
  },
  'agent-company': {
    mixin: 'input-text',
    validate: 'required'
  },
  'agent-name': {
    mixin: 'input-text',
    validate: 'required'
  },
  'agent-address': {},
  'agent-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'agent-phone-number': {
    mixin: 'input-text',
    validate: ['required']
  },
  'declaration-identity': {
    mixin: 'checkbox',
    validate: 'required',
    className: 'label',
    includeInSummary: false
  },
  declaration: {
    mixin: 'checkbox',
    validate: 'required',
    className: 'label',
    includeInSummary: false,
    useWhen: {
      field: 'what',
      value: 'report'
    },
    dependent: {
      field: 'what',
      value: 'report'
    }
  }
};
