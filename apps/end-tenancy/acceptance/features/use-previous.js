'use strict';

Feature('Given I am on the Landlord Address');

// bugfix: ensure that the previous address is saved to the landlord-address. This was not happening before
Scenario('And I select previous address When I go to the confirm page Then I see the landlord address is the previous address', (
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/property-address', {
    what: 'check',
  });
  I.completeToStep('/landlord-address', {
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
    tenants: {
      0: {
        name: 'Sterling Archer',
        'date-of-birth': '1980-11-11',
      }
    },
    name: 'John Smith',
  });
  I.click('#use-previous-address');
  I.submitForm();
  I.seeInCurrentUrl('/confirm-declaration');
});
