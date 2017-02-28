'use strict';

const dateComponent = require('hof-component-date');

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
  'property-address': {},
  name: {
    mixin: 'input-text',
    validate: 'required'
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
    validate: ['required', 'date', 'before'],
    dependent: {
      field: 'tenant-details',
      value: 'date-of-birth'
    }
  }),
  nationality: {
    disableRender: true,
    validate: 'required',
    className: ['typeahead', 'js-hidden'],
    options: [''].concat(require('homeoffice-countries').allCountries),
    dependent: {
      field: 'tenant-details',
      value: 'nationality'
    }
  },
  'reference-number': {
    disableRender: true,
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
    ]
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
    className: 'label'
  },
  declaration: {
    mixin: 'checkbox',
    validate: 'required',
    className: 'label',
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
