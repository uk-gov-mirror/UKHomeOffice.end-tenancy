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
  I.see(propertyAddressPage.content.report);
});

Scenario('I see the correct header if I previously selected "check"', function *(
  I,
  propertyAddressPage
) {
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.refreshPage();
  I.see(propertyAddressPage.content.check);
});

Scenario('I see the correct fields on the page', (
  I,
  propertyAddressPage
) => {
  I.seeElements([
    propertyAddressPage.fields.building,
    propertyAddressPage.fields.street,
    propertyAddressPage.fields.townOrCity,
    propertyAddressPage.fields.postcode
  ]);
});

Scenario('I see an error if I submit the form without entering a building', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.fields.townOrCity,
    propertyAddressPage.content.townOrCity);
  I.fillField(propertyAddressPage.fields.postcode,
    propertyAddressPage.content.postcode);
  I.submitForm();
  I.seeErrors([
    propertyAddressPage.fields.building
  ]);
});

Scenario('I see an error if I submit the form without entering a town or city', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.fields.building,
    propertyAddressPage.content.building);
  I.fillField(propertyAddressPage.fields.postcode,
    propertyAddressPage.content.postcode);
  I.submitForm();
  I.seeErrors([
    propertyAddressPage.fields.townOrCity
  ]);
});

Scenario('I see an error if I submit the form without entering a postcode', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.fields.building,
    propertyAddressPage.content.building);
  I.fillField(propertyAddressPage.fields.townOrCity,
    propertyAddressPage.content.townOrCity);
  I.submitForm();
  I.seeErrors([
    propertyAddressPage.fields.postcode
  ]);
});

Scenario('I see an error if I enter an invalid town or city', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.fields.townOrCity,
    propertyAddressPage.content.invalidTownOrCity);
  I.submitForm();
  I.seeErrors(propertyAddressPage.fields.townOrCity);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.fields.postcode,
    propertyAddressPage.content.invalidPostcode);
  I.submitForm();
  I.seeErrors(propertyAddressPage.fields.postcode);
});

Scenario('I am taken to the tenant-details page on a valid submission', (
  I,
  propertyAddressPage,
  tenantDetailsPage
) => {
  I.fillField(propertyAddressPage.fields.building,
    propertyAddressPage.content.building);
  I.fillField(propertyAddressPage.fields.townOrCity,
    propertyAddressPage.content.townOrCity);
  I.fillField(propertyAddressPage.fields.postcode,
    propertyAddressPage.content.postcode);
  I.submitForm();
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
  I.fillField(propertyAddressPage.fields.building,
    propertyAddressPage.content.building);
  I.fillField(propertyAddressPage.fields.townOrCity,
    propertyAddressPage.content.townOrCity);
  I.fillField(propertyAddressPage.fields.postcode,
    propertyAddressPage.content.postcode);
  I.submitForm();
  I.seeInCurrentUrl(tenancyStartPage.url);
});

