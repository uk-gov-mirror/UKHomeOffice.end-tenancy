'use strict';

let I;

const translations = require('../../translations/en/default.json').pages['nldp-date'].intro;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'nldp-date',
  fields: {
    date: '#nldp-date-group',
    day: '#nldp-date-day',
    month: '#nldp-date-month',
    year: '#nldp-date-year'
  },
  content: {
    check: translations.what.check,
    report: translations.default,
    'future-date': {
      day: '1',
      month: '1',
      year: '2050'
    },
    'invalid-date': {
      day: 'd',
      month: 'm',
      year: 'y'
    },
    'valid-date': {
      day: '1',
      month: '1',
      year: '2016'
    }
  },

  enterDate(type) {
    ['day', 'month', 'year'].forEach(part => {
      I.fillField(this.fields[part], this.content[`${type}-date`][part]);
    });
  }
};
