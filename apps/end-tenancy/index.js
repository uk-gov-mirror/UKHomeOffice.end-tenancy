'use strict';

const controllers = require('hof').controllers;

module.exports = {
  name: 'end-tenancy',
  params: '/:action?',
  steps: {
    '/': {
      controller: controllers.start,
      next: '/what'
    },
    '/what': {
      fields: [
        'what'
      ],
      next: '/report-nldp-date',
      forks: [{
        target: '/request',
        condition: {
          field: 'what',
          value: 'request'
        }
      }, {
        target: '/check',
        condition: {
          field: 'what',
          value: 'check'
        }
      }],
      locals: {
        section: 'what',
        'report-link': 'https://eforms.homeoffice.gov.uk/outreach/lcs-reporting.ofml'
      }
    },
    '/report-nldp-date': {
      controller: require('hof').controllers.date,
      fields: [
        'report-nldp-date',
        'report-nldp-date-day',
        'report-nldp-date-month',
        'report-nldp-date-year'
      ],
      next: '/report-property-address',
      dateKey: 'report-nldp-date',
      locals: {
        section: 'report-nldp-date'
      }
    },
    '/report-property-address': {
      controller: require('./controllers/address-lookup'),
      addressField: 'address',
      next: '/tenant-details'
    },
    '/tenant-details': {},
    '/request': {},
    '/check': {}
  }
};
