'use strict';

const moment = require('moment');
const SummaryPage = require('hof-behaviour-summary-page');
const AddressLookup = require('./behaviours/address-lookup');
const UsePrevious = require('./behaviours/use-previous');
const Loop = require('./behaviours/loop');
const ResetOnChange = require('./behaviours/reset-on-change');
const LocalSummary = require('./behaviours/summary');
const ExposeEmail = require('./behaviours/expose-email');

const requestRoute = req => req.sessionModel.get('what') === 'request';
const checkRoute = req => req.sessionModel.get('what') === 'check';

const DATE_FORMAT = 'YYYY-MM-DD';
const PRETTY_DATE_FORMAT = 'Do MMMM YYYY';

const prettyDate = val => moment(val, DATE_FORMAT).format(PRETTY_DATE_FORMAT);

module.exports = {
  name: 'end-tenancy',
  params: '/:action?/:id?/:edit?',
  steps: {
    '/what': {
      fields: [
        'what'
      ],
      behaviours: ResetOnChange({
        field: 'what'
      }),
      next: '/nldp-date',
      forks: [{
        target: '/property-address',
        condition: {
          field: 'what',
          value: 'request'
        }
      }],
      locals: {
        'report-link': 'https://eforms.homeoffice.gov.uk/outreach/lcs-reporting.ofml',
        'right-to-rent-check-link': 'https://www.gov.uk/check-tenant-right-to-rent-documents/further-checks'
      },
      continueOnEdit: true
    },
    '/nldp-date': {
      fields: [
        'nldp-date'
      ],
      next: '/property-address'
    },
    '/property-address': {
      behaviours: AddressLookup,
      fields: [
        'property-address'
      ],
      countries: [
        'england'
      ],
      addressKey: 'property-address',
      next: '/tenant-details',
      forks: [{
        target: '/tenancy-start',
        condition: requestRoute
      }]
    },
    '/tenancy-start': {
      fields: [
        'tenancy-start'
      ],
      next: '/tenant-details'
    },
    '/tenant-details': {
      behaviours: Loop,
      storeKey: 'tenants',
      fields: [
        'name',
        'date-left',
        'tenant-details',
        'date-of-birth',
        'nationality',
        'reference-number',
        'add-another'
      ],
      firstStep: 'name',
      subSteps: {
        name: {
          fields: [
            'name'
          ],
          next: 'date-left',
          forks: [{
            target: 'add-another',
            condition: checkRoute
          }, {
            target: 'details',
            condition: requestRoute
          }]
        },
        'date-left': {
          dateKey: 'date-left',
          fields: [
            'date-left'
          ],
          prereqs: ['name'],
          next: 'add-another'
        },
        details: {
          dateKey: 'date-of-birth',
          fields: [
            'tenant-details',
            'date-of-birth',
            'nationality',
            'reference-number'
          ],
          prereqs: ['name'],
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
      next: '/landlord-agent'
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
      behaviours: [AddressLookup, UsePrevious({
        useWhen: {
          field: 'who',
          value: 'landlord'
        },
        previousAddress: 'property-address'
      })],
      addressKey: 'landlord-address',
      fields: [
        'landlord-address'
      ],
      next: '/confirm'
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
      behaviours: AddressLookup,
      addressKey: 'agent-address',
      fields: [
        'agent-address'
      ],
      next: '/landlord-name'
    },
    '/landlord-name': {
      fields: [
        'landlord-name-agent'
      ],
      next: '/landlord-address'
    },
    '/confirm': {
      behaviours: [SummaryPage, LocalSummary, 'complete'],
      fields: [
        'declaration-identity',
        'declaration'
      ],
      sections: {
        'key-details': [
          'what',
          {
            field: 'nldp-date',
            parse: prettyDate
          },
          'property-address',
          {
            field: 'tenancy-start',
            parse: prettyDate
          }
        ],
        'tenants-left': [
          'name',
          {
            field: 'date-left',
            parse: prettyDate
          },
          {
            field: 'date-of-birth',
            parse: prettyDate
          },
          'nationality',
          'reference-number'
        ],
        'landlord-details': [
          'landlord-name',
          'landlord-company',
          'landlord-email-address',
          'landlord-phone-number',
          'landlord-address',
          'landlord-name-agent'
        ],
        'agent-details': [
          'agent-company',
          'agent-name',
          'agent-email-address',
          'agent-phone-number',
          'agent-address'
        ]
      },
      next: '/confirmation'
    },
    '/confirmation': {
      behaviours: ExposeEmail,
      backLink: false
    }
  }
};
