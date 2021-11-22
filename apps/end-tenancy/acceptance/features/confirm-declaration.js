'use strict';

const steps = require('../../');

Feature('Confirm Declaration Page');

Before((
  I,
  confirmDeclarationPage
) => {
  I.visitPage(confirmDeclarationPage, steps);
});

Scenario('I return to confirmation-declaration after I edit postcode', function *(
  I
) {
  I.amOnPage('/');
  yield I.completeToStep('/confirm-declaration', {
    what: 'check',
    building: '5 Street',
    townOrCity: 'Town',
    postcode : 'CR0 2EU',
    'tenancy-start-day': '11',
    'tenancy-start-month': '11',
    'tenancy-start-year': '1111',
    'who': 'landlord',
    'landlord-name': 'Fred Bloggs',
    'landlord-company': 'UK Home Office',
    'landlord-email-address': 'sterling@archer.com',
    'landlord-phone-number': '01234567890',
    'landlord-building': '5 Street',
    'landlord-townOrCity': 'Town',
    'landlord-postcode': 'CR0 2EU',
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-of-birth': '1980-11-11',
      }
    },
    name: 'John Smith',
  });
  I.seeInCurrentUrl('/confirm-declaration');
  I.click('#postcode-change');
  I.seeInCurrentUrl('/property-address');
  I.submitForm();
  I.seeInCurrentUrl('/confirm-declaration');
});

Scenario('I return to confirmation-declaration after I edit nldp-date', (
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm-declaration', {
    what: 'check',
    building: '5 Street',
    townOrCity: 'Town',
    postcode : 'CR0 2EU',
    'tenancy-start-day': '11',
    'tenancy-start-month': '11',
    'tenancy-start-year': '1111',
    'who': 'landlord',
    'landlord-name': 'Fred Bloggs',
    'landlord-company': 'UK Home Office',
    'landlord-email-address': 'sterling@archer.com',
    'landlord-phone-number': '01234567890',
    'landlord-building': '5 Street',
    'landlord-townOrCity': 'Town',
    'landlord-postcode': 'CR0 2EU',
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
