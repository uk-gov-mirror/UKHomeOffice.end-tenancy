'use strict';

const controllers = require('hof').controllers;
const ContactController = require('./controllers/contact');
const AddressLookupController = require('./controllers/address-lookup');
const LoopController = require('./controllers/loop');

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
        target: '/contact',
        condition: {
          field: 'what',
          value: 'request'
        }
      }],
      locals: {
        section: 'tenant-property',
        'report-link': 'https://eforms.homeoffice.gov.uk/outreach/lcs-reporting.ofml'
      }
    },
    '/contact': {
      controller: ContactController
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
      controller: AddressLookupController,
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
      controller: LoopController,
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
      controller: AddressLookupController,
      addressKey: 'landlord-address',
      fields: [
        'landlord-address'
      ],
      previousAddress: 'property-address',
      next: '/confirm',
      useWhen: {
        field: 'who',
        value: 'landlord'
      },
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
      controller: AddressLookupController,
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
      fields: [
        'landlord-name'
      ],
      next: '/landlord-address'
    },
    '/confirm': {
      next: '/confirmation'
    },
    '/confirmation': {}
  }
};
