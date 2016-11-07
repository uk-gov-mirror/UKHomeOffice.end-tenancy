'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'tenant-details',

  name: {
    url: '/name',
    fields: {
      name: '#name'
    },
    content: {
      name: 'Sterling Archer'
    }
  },

  date: {
    url: '/date',
    fields: {
      date: '#date-left-group',
      day: '#date-left-day',
      month: '#date-left-month',
      year: '#date-left-year'
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
    }
  },

  'add-another': {
    url: '/add-another',

    fields: {
      'add-another': '#add-another-group',
      yes: '[value=yes]',
      no: '[value=no]'
    }
  },

  enterNameAndSubmit() {
    I.fillField(this.name.fields.name, this.name.content.name);
    I.submitForm();
  },

  enterNameAndDateAndSubmit() {
    this.enterNameAndSubmit();
    this.enterDate('valid');
    I.submitForm();
  },

  enterDate(type) {
    ['day', 'month', 'year'].forEach(part => {
      I.fillField(this.date.fields[part], this.date.content[`${type}-date`][part]);
    });
  },

  addTenant() {
    this.enterNameAndDateAndSubmit();
    I.checkOption(this['add-another'].fields.yes);
    I.submitForm();
  }
};
