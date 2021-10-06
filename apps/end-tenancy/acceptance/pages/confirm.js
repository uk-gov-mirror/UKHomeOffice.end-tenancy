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

  url: 'confirm',

  'request-notice': {
    what: 'request',
    building: '5 Street',
    townOrCity: 'Town',
    postcode : 'CR0 2EU',
    'tenancy-start': '1111-11-11',
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-of-birth': '1980-11-11',
      }
    },
    name: 'John Smith',
    'landlord-name': 'Fred Bloggs',
    'landlord-company': 'UK Home Office',
    'landlord-email-address': 'sterling@archer.com',
    'landlord-phone-number': '01234567890',
    'landlord-building': '5 Street',
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
