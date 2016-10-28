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
  'report-nldp-date': {
    labelClassName: 'visuallyhidden'
  },
  'report-nldp-date-day': {
    validate: ['required', 'numeric']
  },
  'report-nldp-date-month': {
    validate: ['required', 'numeric']
  },
  'report-nldp-date-year': {
    validate: ['required', 'numeric']
  }
};
