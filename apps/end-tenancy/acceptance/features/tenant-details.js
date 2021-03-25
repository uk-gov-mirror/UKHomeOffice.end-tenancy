'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Report Tenants - loop');

Before((
  I,
  tenantDetailsPage
) => {
  I.visitPage(tenantDetailsPage, steps);
});

Scenario('I am taken to the name substep when I arrive on the page', (
  I,
  tenantDetailsPage
) => {
  I.seeInCurrentUrl(tenantDetailsPage.name.url);
});

Scenario('I dont see a delete button on page load', (
  I,
  tenantDetailsPage
) => {
  I.dontSeeElement(tenantDetailsPage.deleteButton);
});

Scenario('I do not see a summary table if no tenants have been added', (
  I,
  tenantDetailsPage
) => {
  I.dontSeeElement(tenantDetailsPage.summaryTable);
});

Scenario('I see a summary table if a tenant has been added', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-left': '01-01-2001'
      }
    }
  });
  yield I.refreshPage();
  I.seeElement(tenantDetailsPage.summaryTable);
});

Scenario('I see the correct label if I am on the "report" journey', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'report'
  });
  yield I.refreshPage();
  I.see(tenantDetailsPage.name.content.report);
});

Scenario('I see the correct label if I am on the "check" journey', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.refreshPage();
  I.see(tenantDetailsPage.name.content.check);
});

Scenario('I see the correct label if I am on the "request" journey', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'request'
  });
  yield I.refreshPage();
  I.see(tenantDetailsPage.name.content.request);
});

Scenario('I submit the form without completing name', (
  I,
  tenantDetailsPage
) => {
  I.submitForm();
  I.seeErrors(tenantDetailsPage.name.fields.name);
});

Scenario('I enter a name and am taken to the date substep', (
  I,
  tenantDetailsPage
) => {
  I.fillField(tenantDetailsPage.name.fields.name,
    tenantDetailsPage.name.content.name);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.date.url);
});

Scenario('I am taken to the add-another substep if I am on the "check" journey', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.refreshPage();
  I.fillField(tenantDetailsPage.name.fields.name,
    tenantDetailsPage.name.content.name);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage['add-another'].url);
});

Scenario('I am taken to the details substep if I am on the "request" journey', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'request'
  });
  yield I.refreshPage();
  I.fillField(tenantDetailsPage.name.fields.name,
    tenantDetailsPage.name.content.name);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.details.url);
});

Scenario('I see the correct fields on the details substep', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.seeElements(_.values(tenantDetailsPage.details.fields.visible));
});

Scenario('I don\'t see the progressive reveal fields on page load', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.dontSeeElements(_.values(tenantDetailsPage.details.fields.hidden));
});

Scenario('I am able to submit the form without selecting any option', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage['add-another'].url);
});

Scenario('I see the date field if I select date', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.checkOption(tenantDetailsPage.details.fields.options.dob);
  I.seeElement(tenantDetailsPage.details.fields.hidden.dob);
});

Scenario('I see an error if I select date and submit without entering a date', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.checkOption(tenantDetailsPage.details.fields.options.dob);
  I.submitForm();
  I.seeErrors(tenantDetailsPage.details.fields.hidden.dob);
});

Scenario('I see the nationality field if I select nationality', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.checkOption(tenantDetailsPage.details.fields.options.nationality);
  I.seeElement(tenantDetailsPage.details.fields.hidden.nationality);
});

Scenario('I see an error if I select nationality and submit without entering a nationality', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.checkOption(tenantDetailsPage.details.fields.options.nationality);
  I.submitForm();
  I.seeErrors(tenantDetailsPage.details.fields.hidden.nationality);
});

Scenario('I see the reference field if I select reference', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.checkOption(tenantDetailsPage.details.fields.options.reference);
  I.seeElement(tenantDetailsPage.details.fields.hidden.reference);
});

Scenario('I see an error if I select reference and submit without entering a reference', function *(
  I,
  tenantDetailsPage
) {
  yield tenantDetailsPage.enterNameAndSubmitRequestJourney(steps.name);
  I.checkOption(tenantDetailsPage.details.fields.options.reference);
  I.submitForm();
  I.seeErrors(tenantDetailsPage.details.fields.hidden.reference);
});

Scenario('I see an error if I don\'t enter a date', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterNameAndSubmit();
  I.submitForm();
  I.seeErrors(tenantDetailsPage.date.fields.date);
});

Scenario('I see an error if I enter an invalid date', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterNameAndSubmit();
  tenantDetailsPage.enterDate('invalid');
  I.submitForm();
  I.seeErrors(tenantDetailsPage.date.fields.date);
});

Scenario('I see an error if I enter a future date', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterNameAndSubmit();
  tenantDetailsPage.enterDate('future');
  I.submitForm();
  I.seeErrors(tenantDetailsPage.date.fields.date);
});

Scenario('I am taken to the add-another sub-step if I enter a valid date', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterNameAndSubmit();
  tenantDetailsPage.enterDate('valid');
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage['add-another'].url);
});

Scenario('I see an error if I submit the add-another sub-step without selecting an option', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterNameAndDateAndSubmit();
  I.submitForm();
  I.seeErrors(tenantDetailsPage['add-another'].fields['add-another']);
});

Scenario('I am taken to the name substep if I select yes', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterNameAndDateAndSubmit();
  I.checkOption(tenantDetailsPage['add-another'].fields.yes);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.name.url);
});

Scenario('I am taken to the who page if I select no', (
  I,
  tenantDetailsPage,
  whoPage
) => {
  tenantDetailsPage.enterNameAndDateAndSubmit();
  I.checkOption(tenantDetailsPage['add-another'].fields.no);
  I.submitForm();
  I.seeInCurrentUrl(whoPage.url);
});

Scenario('I can edit a previously added tenant name', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.addTenant();
  I.amOnPage(`/${tenantDetailsPage.url}${tenantDetailsPage.name.url}/0`);
  I.seeInField(tenantDetailsPage.name.fields.name, tenantDetailsPage.name.content.name);
});

Scenario('I see the correct title if I am reporting a second tenant', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.addTenant();
  I.see(tenantDetailsPage.name.content.reportAnother);
});

Scenario('I see the correct title if I am checking a second tenant', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.refreshPage();
  tenantDetailsPage.enterNameAndSubmit();
  I.checkOption(tenantDetailsPage['add-another'].fields.yes);
  I.submitForm();
  I.see(tenantDetailsPage.name.content.checkAnother);
});

Scenario('I see the correct title if I am requesting an nldp for a second tenant', function *(
  I,
  tenantDetailsPage
) {
  yield I.setSessionData(steps.name, {
    what: 'request',
    tenants: {
      0: {
        name: 'Sterling Archer'
      }
    }
  });
  yield I.refreshPage();
  I.see(tenantDetailsPage.name.content.requestAnother);
});

Scenario('I see a delete button if I add a tenant', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.addTenant();
  I.seeElement(tenantDetailsPage.deleteButton);
});

Scenario('I am taken to the add-another page if I delete a tenant but I still have tenants left', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.addTenant();
  tenantDetailsPage.addTenant();
  I.click(tenantDetailsPage.deleteButton);
  I.seeInCurrentUrl(tenantDetailsPage['add-another'].url);
});

Scenario('I am taken to the name page if I delete the only tenant', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.addTenant();
  I.click(tenantDetailsPage.deleteButton);
  I.seeInCurrentUrl(tenantDetailsPage.name.url);
});

Scenario('I dont see a delete button if I delete all tenants', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.addTenant();
  I.click(tenantDetailsPage.deleteButton);
  I.dontSeeElement(tenantDetailsPage.deleteButton);
});
