'use strict';

const steps = require('../../');

Feature('Property Address Step(s)');

Before((
  I,
  propertyAddressPage
) => {
  I.visitPage(propertyAddressPage, steps);
});

Scenario('I see the correct header if I previously selected "report"', function *(
  I,
  propertyAddressPage
) {
  yield I.setSessionData(steps.name, {
    what: 'report'
  });
  yield I.refreshPage();
  I.see(propertyAddressPage.postcode.content.report);
});

Scenario('I see the correct header if I previously selected "check"', function *(
  I,
  propertyAddressPage
) {
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.refreshPage();
  I.see(propertyAddressPage.postcode.content.check);
});

Scenario('I see the postcode entry field', (
  I,
  propertyAddressPage
) => {
  I.seeElements(propertyAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I submit the step without filling in the field', (
  I,
  propertyAddressPage
) => {
  I.submitForm();
  I.seeErrors(propertyAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I submit the step with an invalid postcode', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.postcode.fields.postcode,
    propertyAddressPage.postcode.content.invalid);
  I.submitForm();
  I.seeErrors(propertyAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I enter a postcode that isn\'t in England', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.postcode.fields.postcode,
    propertyAddressPage.postcode.content.welsh
  );
  I.submitForm();
  I.seeErrors(propertyAddressPage.postcode.fields.postcode);
});

Scenario('I am taken to the address page if the postcode isn\'t found', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.postcode.fields.postcode,
    propertyAddressPage.postcode.content.notFound);
  I.submitForm();
  I.seeInCurrentUrl(propertyAddressPage.address.url);
  I.seeElement(propertyAddressPage.address.failedMessage);
});

Scenario('I am taken to the /lookup substep if I submit a valid postcode', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.postcode.fields.postcode,
    propertyAddressPage.postcode.content.valid);
  I.submitForm();
  I.seeInCurrentUrl(propertyAddressPage.lookup.url);
});

Scenario('I see an error if I submit a Belfast postcode', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.postcode.fields.postcode,
    propertyAddressPage.postcode.content.belfast);
  I.submitForm();
  I.seeErrors(propertyAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I try and continue without selecting an address', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.submitForm();
  I.seeErrors(propertyAddressPage.lookup.fields['address-select']);
});

Scenario('I am taken to the manual entry step if I click the cant-find link', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.click(propertyAddressPage.links['cant-find']);
  I.seeInCurrentUrl(propertyAddressPage.manual.url);
});

Scenario('I see an error if I sumbit the manual step without completing', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.click(propertyAddressPage.links['cant-find']);
  I.submitForm();
  I.seeErrors(propertyAddressPage.manual.fields.address);
});

Scenario('I am taken to the tenant-details step if I fill in the manual address field and submit', (
  I,
  propertyAddressPage,
  tenantDetailsPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.click(propertyAddressPage.links['cant-find']);
  I.fillField(propertyAddressPage.manual.fields.address,
    propertyAddressPage.address.content);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('I am taken to the postcode step if I click the change-postcode link', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.click(propertyAddressPage.links['change-postcode']);
  I.seeInCurrentUrl(propertyAddressPage.postcode.url);
});

Scenario('I am taken to the tenant-details step if I select a valid address', (
  I,
  propertyAddressPage,
  tenantDetailsPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.selectOption(propertyAddressPage.lookup.fields['address-select'],
    propertyAddressPage.lookup.content['address-select']);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('I am taken to the tenant-details page on a valid submission', (
  I,
  propertyAddressPage,
  tenantDetailsPage
) => {
  propertyAddressPage.selectAddressAndSubmit();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('I am taken to the tenancy-start page if I am requesting an nldp', function *(
  I,
  propertyAddressPage,
  tenancyStartPage
) {
  yield I.setSessionData(steps.name, {
    what: 'request'
  });
  yield I.refreshPage();
  propertyAddressPage.selectAddressAndSubmit();
  I.seeInCurrentUrl(tenancyStartPage.url);
});
