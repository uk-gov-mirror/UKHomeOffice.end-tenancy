'use strict';

const moment = require('moment');
const config = require('../../../config');

module.exports = {
  'key-details': [
    'what',
    'building',
    'street',
    'townOrCity',
    'postcode',
    {
      field: 'tenancy-start',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    }
  ],
  'tenants-left': [
    'name',
    {
      field: 'date-left',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    {
      field: 'date-of-birth',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    'nationality',
    'reference-number'
  ],
  'landlord-details': [
    'landlord-name',
    'landlord-company',
    'landlord-email-address',
    'landlord-phone-number',
    'landlord-building',
    'landlord-street',
    'landlord-townOrCity',
    'landlord-postcode',
    'landlord-name-agent'
  ],
  'agent-details': [
    'agent-company',
    'agent-name',
    'agent-email-address',
    'agent-phone-number',
    'agent-building',
    'agent-street',
    'agent-townOrCity',
    'agent-postcode'
  ]
};
