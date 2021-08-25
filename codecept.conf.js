'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/end-tenancy/acceptance/pages/${page}`);

/* eslint no-process-env: 0 */
module.exports = require('so-acceptance').extend({
  name: 'end-tenancy',
  tests: './apps/**/acceptance/features/*.js',
  helpers: {
    WebDriverIO: {
      host: 'localhost',
      port: 4444,
      path: '/wd/hub',
      url: process.env.TEST_URL || 'http://localhost:8080',
      browser: 'chrome',
      desiredCapabilities: {
        chromeOptions: { args: ['headless', 'disable-gpu'] }
      }
    }
  },
  include: {
    whatPage: pagesPath('what.js'),
    reportDatePage: pagesPath('nldp-date.js'),
    propertyAddressPage: pagesPath('property-address.js'),
    tenantDetailsPage: pagesPath('tenant-details.js'),
    tenancyStartPage: pagesPath('tenancy-start.js'),
    whoPage: pagesPath('who.js'),
    landlordDetailsPage: pagesPath('landlord-details.js'),
    landlordAddressPage: pagesPath('landlord-address.js'),
    agentDetailsPage: pagesPath('agent-details.js'),
    agentAddressPage: pagesPath('agent-address.js'),
    landlordNamePage: pagesPath('landlord-name.js'),
    confirmPage: pagesPath('confirm.js'),
    confirmDeclarationPage: pagesPath('confirm-declaration.js'),
    confirmationPage: pagesPath('confirmation.js')
  }
});
