'use strict';

const steps = require('../../');

Feature('Confirm Declaration Page');

Before((
  I,
  confirmDeclarationPage
) => {
  I.visitPage(confirmDeclarationPage, steps);
});

Scenario('I see the correct table information if I am a landlord reporting 1 tenant left', function *(
  I,
  confirmDeclarationPage
) {
  yield confirmDeclarationPage.setSessionData(steps.name, 'report-landlord');
  yield I.refreshPage();
  confirmDeclarationPage.checkData('report-landlord');
  yield I.dontSee('Date of birth');
  yield I.checkOption('#declaration');
  yield I.submitForm();
  I.seeInCurrentUrl('/confirmation');
});

Scenario('I see the correct table information if I am an agent reporting 2 tenants left', function *(
  I,
  confirmDeclarationPage
) {
  yield confirmDeclarationPage.setSessionData(steps.name, 'report-agent');
  yield I.refreshPage();
  confirmDeclarationPage.checkData('report-agent');
  yield I.checkOption('#declaration');
  yield I.submitForm();
  I.seeInCurrentUrl('/confirmation');
});

Scenario('I see the correct table information if I am a landlord checking a single tenant', function *(
  I,
  confirmDeclarationPage
) {
  yield confirmDeclarationPage.setSessionData(steps.name, 'check-landlord');
  yield I.refreshPage();
  confirmDeclarationPage.checkData('check-landlord');
  yield I.checkOption('#declaration');
  yield I.submitForm();
  I.seeInCurrentUrl('/confirmation');
});
