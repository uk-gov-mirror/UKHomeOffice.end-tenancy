'use strict';

const steps = require('../../');

Feature('Confirm Page');

Before((
  I,
  confirmPage
) => {
  I.visitPage(confirmPage, steps);
});

Scenario('I see both declaration fields if I am on the "report" journey', function *(
  I,
  confirmPage
) {
  yield I.setSessionData(steps.name, {
    what: 'report'
  });
  yield I.refreshPage();
  I.seeElements([
    confirmPage.fields['declaration-identity'],
    confirmPage.fields.declaration
  ]);
});

Scenario('I dont see the declaration field if I am on the "check" journey', function *(
  I,
  confirmPage
) {
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.refreshPage();
  I.dontSeeElements(confirmPage.fields.declaration);
});

Scenario('I see errors if I submit the form without accepting the declarations', function *(
  I,
  confirmPage
) {
  yield I.setSessionData(steps.name, {
    what: 'report'
  });
  yield I.refreshPage();
  I.submitForm();
  I.seeErrors([
    confirmPage.fields['declaration-identity'],
    confirmPage.fields.declaration
  ]);
});

Scenario('I see the correct table information if I am a landlord reporting 1 tenant left', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'report-landlord');
  yield I.refreshPage();
  confirmPage.checkData('report-landlord');
});

Scenario('I see the correct table information if I am an agent reporting 2 tenants left', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'report-agent');
  yield I.refreshPage();
  confirmPage.checkData('report-agent');
});

Scenario('I see the correct table information if I am a landlord checking a single tenant', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'check-landlord');
  yield I.refreshPage();
  confirmPage.checkData('check-landlord');
});

Scenario('I am taken to the confirmation page if I accept the declaration', (
  I,
  confirmPage,
  confirmationPage
) => {
  I.checkOption(confirmPage.fields['declaration-identity']);
  I.submitForm();
  I.seeInCurrentUrl(confirmationPage.url);
});
