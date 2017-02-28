/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

let I;

const translations = require('../../translations/en/default').pages['tenant-details-name'].header;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'tenant-details',

  summaryTable: '.loop-summary-table',

  deleteButton: '.button-delete',

  name: {
    url: '/name',
    fields: {
      name: '#name'
    },
    content: {
      name: 'Sterling Archer',
      check: translations.what.check.replace('{{next}}', ''),
      request: translations.what.request.replace('{{next}}', ''),
      report: translations.default.replace('{{next}}', ''),
      checkAnother: translations.what.check.replace('{{next}}', 'next '),
      requestAnother: translations.what.request.replace('{{next}}', 'next '),
      reportAnother: translations.default.replace('{{next}}', 'next ')
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

  details: {
    url: '/details',

    fields: {
      visible: {
        details: '#tenant-details-group'
      },
      options: {
        dob: '[value="date-of-birth"]',
        nationality: '[value="nationality"]',
        reference: '[value="reference-number"]'
      },
      hidden: {
        dob: '#date-of-birth-group',
        nationality: '#nationality',
        reference: '#reference-number'
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

  enterNameAndSubmitRequestJourney(name) {
    I.setSessionData(name, {
      what: 'request'
    });
    I.refreshPage();
    this.enterNameAndSubmit();
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
