'use strict';

const controllers = require('hof').controllers;

module.exports = {
  name: 'end-tenancy',
  steps: {
    '/': {
      controller: controllers.start,
      next: '/what'
    },
    '/what': {
      fields: [
        'what'
      ],
      next: '/date-of-issue',
      forks: [{
        target: '/request',
        condition: {
          field: 'what',
          value: 'request'
        }
      }, {
        target: '/check',
        condition: {
          field: 'what',
          value: 'check'
        }
      }],
      locals: {
        section: 'what',
        'report-link': 'https://eforms.homeoffice.gov.uk/outreach/lcs-reporting.ofml'
      }
    },
    '/date-of-issue': {},
    '/request': {},
    '/check': {}
  }
};
