/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

let I;

const translations = require('../../translations/en/default').pages['property-address'].header;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'property-address',
  fields: {
    building: '#building',
    street: '#street',
    townOrCity: '#townOrCity',
    postcode: '#postcode'
  },
  content: {
    building: 'Building',
    street: 'Street',
    townOrCity: 'Town',
    postcode: 'CR0 2EU',
    invalidPostcode: 'xxxxxx',
    invalidTownOrCity: 'Town 1',
    check: translations.default,
    report: translations.what.report,
  }
};
