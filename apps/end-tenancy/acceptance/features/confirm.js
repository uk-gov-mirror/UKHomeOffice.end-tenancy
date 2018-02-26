'use strict';

const steps = require('../../');

Feature('Confirm Page');

Before((
  I,
  confirmPage
) => {
  I.visitPage(confirmPage, steps);
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
