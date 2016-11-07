'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/end-tenancy/acceptance/pages/${page}`);

module.exports = {
  name: 'end-tenancy',
  include: {
    whatPage: pagesPath('what.js'),
    reportDatePage: pagesPath('report-date.js'),
    propertyAddressPage: pagesPath('property-address.js'),
    tenantDetailsPage: pagesPath('tenant-details.js'),
    requestPage: pagesPath('request.js'),
    checkPage: pagesPath('check.js'),
    whoPage: pagesPath('report-landlord-agent.js'),
    landlordAddressPage: pagesPath('landlord-address.js'),
    confirmPage: pagesPath('confirm.js')
  }
};
