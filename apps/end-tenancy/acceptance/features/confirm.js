'use strict';

const steps = require('../../');

Feature('Confirm Page');

Before((
  I,
  confirmPage
) => {
  I.visitPage(confirmPage, steps);
});

Scenario('I see the correct table information if I am a landlord reporting 1 tenant left', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'report-landlord');
  yield I.refreshPage();
  confirmPage.checkData('report-landlord');
  yield I.submitForm();
  I.dontSee('Date of birth');
  I.seeInCurrentUrl('/confirmation');
});

Scenario('I see the correct table information if I am an agent reporting 2 tenants left', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'report-agent');
  yield I.refreshPage();
  confirmPage.checkData('report-agent');
  yield I.submitForm();
  I.seeInCurrentUrl('/confirmation');
});

Scenario('I see the correct table information if I am a landlord checking a single tenant', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'check-landlord');
  yield I.refreshPage();
  confirmPage.checkData('check-landlord');
  yield I.submitForm();
  I.seeInCurrentUrl('/confirmation');
});

Scenario('I see the correct table information if I am requesting an NLDP', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'request-notice');
  yield I.refreshPage();
  I.dontSee('nationality');
  confirmPage.checkData('request-notice');
});

Scenario('I am redirected to the declaration page when I submit the confirm page', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'request-notice');
  yield I.submitForm();
  I.seeInCurrentUrl('/declaration');
});
