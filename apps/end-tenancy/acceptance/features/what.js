'use strict';

const steps = require('../../');

Feature('What page');

Before((
  I,
  whatPage
) => {
  I.visitPage(whatPage, steps);
});

Scenario('I see the correct fields', (
  I,
  whatPage
) => {
  I.seeElements(whatPage.fields.what);
});

Scenario('I see an error if I submit the page without selecting an option', (
  I,
  whatPage
) => {
  I.submitForm();
  I.seeErrors(whatPage.fields.what);
});

Scenario('If I select the report option I am taken to the report date page', (
  I,
  whatPage,
  reportDatePage
) => {
  I.checkOption(whatPage.fields.report);
  I.submitForm();
  I.seeInCurrentUrl(reportDatePage.url);
});

Scenario('If I select the check option I am taken to the report date page', (
  I,
  whatPage,
  reportDatePage
) => {
  I.checkOption(whatPage.fields.check);
  I.submitForm();
  I.seeInCurrentUrl(reportDatePage.url);
});

Scenario('If I select the request option I am taken to the contact page', (
  I,
  whatPage,
  contactPage
) => {
  I.checkOption(whatPage.fields.request);
  I.submitForm();
  I.seeInCurrentUrl(contactPage.url);
});

Scenario('I am taken to the nldp-date page if I change my answer', function *(
  I,
  whatPage,
  reportDatePage
) {
  yield I.setSessionSteps(steps.name, ['/', '/what', '/nldp-date']);
  yield I.refreshPage();
  I.checkOption(whatPage.fields.report);
  I.submitForm();
  I.amOnPage(`/${whatPage.url}/edit`);
  I.checkOption(whatPage.fields.check);
  I.submitForm();
  I.seeInCurrentUrl(reportDatePage.url);
});
