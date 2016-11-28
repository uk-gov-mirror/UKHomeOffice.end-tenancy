'use strict';

const controllers = require('hof-controllers');
const ContactController = require('./controllers/contact');
const AddressLookupController = require('./controllers/address-lookup');
const LoopController = require('./controllers/loop');
const ConfirmController = require('./controllers/confirm');
const ConfirmationController = require('./controllers/confirmation');

module.exports = {
  name: 'end-tenancy',
  params: '/:action?/:id?/:edit?',
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
        section: 'key-details',
        'report-link': 'https://eforms.homeoffice.gov.uk/outreach/lcs-reporting.ofml',
        'right-to-rent-check-link': 'https://www.gov.uk/check-tenant-right-to-rent-documents/further-checks'
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
        section: 'key-details'
      }
    },
    '/property-address': {
      controller: AddressLookupController,
      fields: [
        'property-address'
      ],
      countries: [
        'england'
      ],
      addressKey: 'property-address',
      next: '/tenant-details',
      locals: {
        section: 'key-details'
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
          ],
          next: 'date-left',
          forks: [{
            target: 'add-another',
            condition(req) {
              return req.sessionModel.get('what') === 'check';
            }
          }]
        },
        'date-left': {
          template: 'date',
          fields: [
            'date-left',
            'date-left-day',
            'date-left-month',
            'date-left-year'
          ],
          prereqs: [
            'name'
          ],
          next: 'add-another'
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
        section: 'tenants-left'
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
      ],
      locals: {
        section: 'landlord-details'
      }
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
      next: '/agent-address',
      locals: {
        section: 'agent-details'
      }
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
        'landlord-name-agent'
      ],
      next: '/landlord-address',
      locals: {
        section: 'landlord-details'
      }
    },
    '/confirm': {
      controller: ConfirmController,
      fields: [
        'declaration-identity',
        'declaration'
      ],
      fieldsConfig: require('./fields'),
      emailConfig: require('../../config').email,
      next: '/confirmation'
    },
    '/confirmation': {
      controller: ConfirmationController,
      backLink: false,
      clearSession: false
    }
  }
};
