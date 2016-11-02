'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'report-nldp-date',
  fields: {
    date: '#report-nldp-date-group',
    day: '#report-nldp-date-day',
    month: '#report-nldp-date-month',
    year: '#report-nldp-date-year'
  },
  content: {
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
