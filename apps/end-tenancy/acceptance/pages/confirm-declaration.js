/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

const _ = require('lodash');
const moment = require('moment');
const FORMAT = 'YYYY-MM-DD';
const PRETTY_FORMAT = 'Do MMMM YYYY';

let I;

const formatIfDate = value =>
  value.match(/\d{4}-\d{2}-\d{2}/) ?
    moment(value, FORMAT).format(PRETTY_FORMAT) :
    value;

module.exports = {
  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'confirm-declaration',

  fields: {
    'declaration-identity': '#declaration-identity',
    declaration: '#declaration'
  },

  'report-landlord': {
    what: 'Report that a disqualified person has left your property',
    building: 'Building',
    street: 'Street',
    townOrCity: 'Town',
    postcode : 'CR02EU',
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-left': '1234-02-01'
      }
    },
    'landlord-name': 'Fred Bloggs',
    'landlord-company': 'UK Home Office',
    'landlord-email-address': 'sterling@archer.com',
    'landlord-phone-number': '01234567890',
    'landlord-building': 'Building',
    'landlord-street': 'Street',
    'landlord-townOrCity': 'Town',
    'landlord-postcode': 'CR02EU'
  },

  'report-agent': {
    what: 'Report that a disqualified person has left your property',
    building: 'Building',
    street: 'Street',
    townOrCity: 'Town',
    postcode : 'CR0 2EU',
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-left': '1234-02-01'
      },
      1: {
        name: 'Fred Bloggs',
        'date-left': '1234-03-02'
      }
    },
    'agent-name': 'Mr Agent',
    'agent-company': 'UK Home Office',
    'agent-email-address': 'agent@agent.com',
    'agent-phone-number': '01234567890',
    'landlord-name': 'Fred Bloggs',
    'landlord-building': 'Building',
    'landlord-street': 'Street',
    'landlord-townOrCity': 'Town',
    'landlord-postcode': 'CR0 2EU'
  },

  'check-landlord': {
    what: 'Check if a person living in your property is still disqualified from renting',
    building: 'Building',
    street: 'Street',
    townOrCity: 'Town',
    postcode : 'CR0 2EU',
    tenants: {
      0: {
        name: 'Sterling Archer'
      }
    },
    'landlord-name': 'Fred Bloggs',
    'landlord-company': 'UK Home Office',
    'landlord-email-address': 'sterling@archer.com',
    'landlord-phone-number': '01234567890',
    'landlord-building': 'Building',
    'landlord-street': 'Street',
    'landlord-townOrCity': 'Town',
    'landlord-postcode': 'CR0 2EU'
  },

  setSessionData(name, data) {
    return I.setSessionData(name, this[data]);
  },

  checkData(data) {
    const values = _.values(
      _.omit(this[data], 'tenants')
    ).concat(
      _.flatten(
        _.map(this[data].tenants, field => _.map(field, value => value))
      )
    ).map(formatIfDate);
    values.forEach(value => {
      I.see(value);
    });
  }

};
