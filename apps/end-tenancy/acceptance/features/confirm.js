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

// bugfix
Scenario('I do not see the nldp date', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'request-notice');
  yield I.refreshPage();
  I.dontSee('Date of issue of Notice of Letting to a Disqualified Person');
  confirmPage.checkData('request-notice');
});

Scenario('I do not see fields for information I have  not entered', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'request-notice');
  yield I.refreshPage();
  I.dontSee('nationality');
});

Scenario('I am redirected to the declaration page when I submit the confirm page', function *(
  I,
  confirmPage
) {
  yield confirmPage.setSessionData(steps.name, 'request-notice');
  yield I.submitForm();
  I.seeInCurrentUrl('/declaration');
});

Scenario('I am redirected to the property-address page when I click the Property address change button', (
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    what: 'request',
    'property-address': '123 Example Street Example',
    'tenancy-start-day': '11',
    'tenancy-start-month': '11',
    'tenancy-start-year': '1111',
    'landlord-name': 'Fred Bloggs',
    'who': 'landlord',
    'landlord-company': 'UK Home Office',
    'landlord-email-address': 'sterling@archer.com',
    'landlord-phone-number': '01234567890',
    'landlord-address': '123 Example Street Example',
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-of-birth': '1980-11-11',
      }
    },
    name: 'John Smith',
  });
  I.seeInCurrentUrl('/confirm');
  I.click('a#property-address-change');
  // I.seeInCurrentUrl('/property-address');
});
