'use strict';

Feature('Request NLDP - Happy path');

const values = {
  'what': 'check',
  'building': 'Building',
  'street': 'Street',
  'townOrCity': 'Town',
  'postcode' : 'CR0 2EU',
  'who': 'landlord',
  'landlord-email-address': 's@g.com',
  'add-another': 'no',
  'use-previous-address': 'true',
  'declaration-identity': 'true'
};

Before((
  I
) => {
  I.amOnPage('/');
});

Scenario('An application can be completed end-to-end', (
  I
) => {
  I.completeToStep('/confirmation', values);
  I.seeInCurrentUrl('/confirmation');
});

