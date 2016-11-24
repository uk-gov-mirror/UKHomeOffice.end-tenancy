'use strict';

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
