'use strict';

const steps = require('../../');

Feature('NLDP Date Step');

Before((
  I,
  reportDatePage
) => {
  I.visitPage(reportDatePage, steps);
});

Scenario('The correct fields are on the page', (
  I,
  reportDatePage
) => {
  I.seeElements([
    reportDatePage.fields.date,
    reportDatePage.fields.day,
    reportDatePage.fields.month,
    reportDatePage.fields.year
  ]);
});

Scenario('I see an error if I submit without completing the fields', (
  I,
  reportDatePage
) => {
  I.submitForm();
  I.seeErrors(reportDatePage.fields.date);
});

Scenario('I see an error if I enter an invalid date', (
  I,
  reportDatePage
) => {
  reportDatePage.enterDate('invalid');
  I.submitForm();
  I.seeErrors(reportDatePage.fields.date);
});

Scenario('I see an error if I enter a future date', (
  I,
  reportDatePage
) => {
  reportDatePage.enterDate('future');
  I.submitForm();
  I.seeErrors(reportDatePage.fields.date);
});

Scenario('I am taken to the property-address step if I enter a valid date', (
  I,
  reportDatePage,
  propertyAddressPage
) => {
  reportDatePage.enterDate('valid');
  I.submitForm();
  I.seeInCurrentUrl(propertyAddressPage.url);
});
