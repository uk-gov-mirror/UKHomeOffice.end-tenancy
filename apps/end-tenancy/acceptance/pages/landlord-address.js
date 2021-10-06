/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'landlord-address',
  fields: {
    'landlord-building': '#landlord-building',
    'landlord-street': '#landlord-street',
    'landlord-townOrCity': '#landlord-townOrCity',
    'landlord-postcode': '#landlord-postcode',
    usePrevious: '#use-previous-address'
  },
  content: {
    'landlord-building': 'Building',
    'landlord-street': 'Street',
    'landlord-townOrCity': 'Town',
    'landlord-postcode': 'CR0 2EU',
    invalidPostcode: 'xxxxxx',
    invalidTownOrCity: 'Town 1'
  }
};
