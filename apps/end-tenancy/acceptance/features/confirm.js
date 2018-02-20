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
