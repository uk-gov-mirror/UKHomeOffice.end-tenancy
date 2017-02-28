'use strict';

const steps = require('../../');

Feature('Confirmation page');

Scenario('I see the landlord email address on the page if I am the landlord', function *(
  I,
  confirmationPage
) {
  I.amOnPage('/');
  yield I.setSessionData(steps.name, {
    who: 'landlord',
    what: 'report',
    'landlord-email-address': confirmationPage.content['landlord-email-address']
  });
  yield I.setSessionSteps(steps.name, ['/confirm']);
  yield I.amOnPage('/' + confirmationPage.url);
  I.see(confirmationPage.content['landlord-email-address']);
});

Scenario('I see the agent email address on the page if I am the agent', function *(
  I,
  confirmationPage
) {
  I.amOnPage('/');
  yield I.setSessionData(steps.name, {
    who: 'agent',
    what: 'report',
    'agent-email-address': confirmationPage.content['agent-email-address']
  });
  yield I.setSessionSteps(steps.name, ['/confirm']);
  yield I.amOnPage('/' + confirmationPage.url);
  I.see(confirmationPage.content['agent-email-address']);
});

Scenario('I see the check message if I am on the "check" journey', function *(
  I,
  confirmationPage
) {
  I.amOnPage('/');
  yield I.setSessionData(steps.name, {
    what: 'check'
  });
  yield I.setSessionSteps(steps.name, ['/confirm']);
  yield I.amOnPage('/' + confirmationPage.url);
  I.see(confirmationPage.content.checkAlert);
});

Scenario('I see the report message if I am on the "report" journey', function *(
  I,
  confirmationPage
) {
  I.amOnPage('/');
  yield I.setSessionData(steps.name, {
    what: 'report'
  });
  yield I.setSessionSteps(steps.name, ['/confirm']);
  yield I.amOnPage('/' + confirmationPage.url);
  I.see(confirmationPage.content.reportAlert);
});

Scenario('I am not redirected to the start page when I refresh', function *(
  I,
  confirmationPage
) {
  yield I.visitPage(confirmationPage, steps);
  yield I.refreshPage();
  I.seeInCurrentUrl(confirmationPage.url);
});
