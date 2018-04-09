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

Scenario('I return to confirmation-declaration after I edit property-address', function *(
  I
) {
  I.amOnPage('/');
  yield I.completeToStep('/confirm-declaration', {
    what: 'check',
    'property-address': '123 Example Street Example',
    'tenancy-start-day': '11',
    'tenancy-start-month': '11',
    'tenancy-start-year': '1111',
    'who': 'landlord',
    'landlord-name': 'Fred Bloggs',
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
  I.seeInCurrentUrl('/confirm-declaration');
  I.click('#property-address-change');
  I.seeInCurrentUrl('/property-address');
  I.click('form .link a');
  I.submitForm();
  I.seeInCurrentUrl('/confirm-declaration');
});

Scenario('I return to confirmation-declaration after I edit nldp-date', (
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm-declaration', {
    what: 'check',
    'property-address': '123 Example Street Example',
    'tenancy-start-day': '11',
    'tenancy-start-month': '11',
    'tenancy-start-year': '1111',
    'who': 'landlord',
    'landlord-name': 'Fred Bloggs',
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
  I.seeInCurrentUrl('/confirm-declaration');
  I.click('#nldp-date-change');
  I.seeInCurrentUrl('/nldp-date');
  I.submitForm();
  I.seeInCurrentUrl('/confirm-declaration');
});
