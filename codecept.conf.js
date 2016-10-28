'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/end-tenancy/acceptance/pages/${page}`);

module.exports = {
  name: 'end-tenancy',
  include: {
    whatPage: pagesPath('what.js'),
    dateOfIssuePage: pagesPath('date-of-issue.js'),
    requestPage: pagesPath('request.js'),
    checkPage: pagesPath('check.js')
  }
};
