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
      next: '/nldp-date',
      forks: [{
        target: '/request-property-address',
        condition: {
          field: 'what',
          value: 'request'
        }
      }, {
        target: '/check-nldp-date',
        condition: {
          field: 'what',
          value: 'check'
        }
      }],
      locals: {
        section: 'tenant-property',
        'report-link': 'https://eforms.homeoffice.gov.uk/outreach/lcs-reporting.ofml'
      }
    },
    '/nldp-date': {
      controller: controllers.date,
      fields: [
        'nldp-date',
        'nldp-date-day',
        'nldp-date-month',
        'nldp-date-year'
      ],
      next: '/property-address',
      dateKey: 'nldp-date',
      locals: {
        section: 'tenant-property'
      }
    },
    '/property-address': {
      controller: require('./controllers/address-lookup'),
      fields: [
        'property-address'
      ],
      addressKey: 'property-address',
      next: '/tenant-details',
      locals: {
        section: 'tenant-property'
      }
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
          ]
        },
        date: {
          template: 'date',
          fields: [
            'date-left',
            'date-left-day',
            'date-left-month',
            'date-left-year'
          ]
        },
        'add-another': {
          fields: [
            'add-another'
          ]
        }
      },
      loopCondition: {
        field: 'add-another',
        value: 'yes'
      },
      next: '/landlord-agent',
      locals: {
        section: 'tenant-property'
      }
    },
    '/landlord-agent': {
      fields: [
        'who'
      ],
      next: '/landlord-details',
      forks: [{
        target: '/agent-details',
        condition: {
          field: 'who',
          value: 'agent'
        }
      }]
    },
    '/landlord-details': {
      next: '/landlord-address',
      fields: [
        'landlord-name',
        'landlord-company',
        'landlord-email-address',
        'landlord-phone-number'
      ]
    },
    '/landlord-address': {
      controller: require('./controllers/address-lookup'),
      addressKey: 'landlord-address',
      fields: [
        'landlord-address'
      ],
      previousAddress: 'property-address',
      next: '/confirm',
      locals: {
        section: 'landlord-details'
      }
    },
    '/agent-details': {
      fields: [
        'agent-company',
        'agent-name',
        'agent-email-address',
        'agent-phone-number'
      ],
      next: '/agent-address'
    },
    '/agent-address': {
      controller: require('./controllers/address-lookup'),
      addressKey: 'agent-address',
      fields: [
        'agent-address'
      ],
      next: '/landlord-name',
      locals: {
        section: 'agent-details'
      }
    },
    '/landlord-name': {
      next: '/landlord-address'
    },
    '/confirm': {
      next: '/confirmation'
    },
    confirm: {
      next: '/confirmation'
    },
    '/request-property-address': {},
    '/check-nldp-date': {},
    '/confirmation': {}
  }
};
