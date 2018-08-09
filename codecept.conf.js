'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/end-tenancy/acceptance/pages/${page}`);

module.exports = require('so-acceptance').extend({
  name: 'end-tenancy',
  include: {
    whatPage: pagesPath('what.js'),
    reportDatePage: pagesPath('nldp-date.js'),
    propertyAddressPage: pagesPath('property-address.js'),
    tenantDetailsPage: pagesPath('tenant-details.js'),
    contactPage: pagesPath('contact.js'),
    whoPage: pagesPath('who.js'),
    landlordDetailsPage: pagesPath('landlord-details.js'),
    landlordAddressPage: pagesPath('landlord-address.js'),
    agentDetailsPage: pagesPath('agent-details.js'),
    agentAddressPage: pagesPath('agent-address.js'),
    landlordNamePage: pagesPath('landlord-name.js'),
    confirmPage: pagesPath('confirm.js'),
    confirmationPage: pagesPath('confirmation.js')
  }
});
