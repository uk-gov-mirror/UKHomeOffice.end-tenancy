/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'agent-address',
  fields: {
    'agent-building': '#agent-building',
    'agent-street': '#agent-street',
    'agent-townOrCity': '#agent-townOrCity',
    'agent-postcode': '#agent-postcode'
  },
  content: {
    'agent-building': 'Building',
    'agent-street': 'Street',
    'agent-townOrCity': 'Town',
    'agent-postcode': 'CR0 2EU',
    invalidPostcode: 'xxxxxx',
    invalidTownOrCity: 'Town 1'
  }
};
