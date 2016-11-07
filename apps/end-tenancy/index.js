'use strict';

const controllers = require('hof').controllers;

module.exports = {
  name: 'end-tenancy',
  params: '/:action?/:id?',
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
      addressKey: 'property-address',
      next: '/tenant-details'
    },
    '/tenant-details': {
      controller: require('./controllers/loop.js'),
      storeKey: 'tenants',
      dateKey: 'date-left',
      fields: [
        'name',
        'date-left',
        'date-left-day',
        'date-left-month',
        'date-left-year',
        'add-another'
      ],
      subSteps: {
        name: {
          fields: [
            'name'
          ],
          locals: {
            section: 'tenant-name',
            subsection: 'tenant-name-hint'
          }
        },
        date: {
          template: 'date',
          fields: [
            'date-left',
            'date-left-day',
            'date-left-month',
            'date-left-year'
          ],
          locals: {
            section: 'tenant-date-left',
            subsection: 'tenant-date-left-hint'
          }
        },
        'add-another': {
          fields: [
            'add-another'
          ],
          locals: {
            section: 'add-another'
          }
        }
      },
      loopCondition: {
        field: 'add-another',
        value: 'yes'
      },
      next: '/report-landlord-agent'
    },
    '/report-landlord-agent': {
      next: '/landlord-address'
    },
    '/landlord-address': {
      controller: require('./controllers/address-lookup'),
      addressKey: 'landlord-address',
      previousAddress: 'property-address',
      next: '/confirm'
    },
    '/confirm': {},
    '/request': {},
    '/check': {}
  }
};
