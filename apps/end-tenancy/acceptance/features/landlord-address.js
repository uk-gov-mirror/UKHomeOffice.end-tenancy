'use strict';

const steps = require('../../');

Feature('Landlord Address');

Before((
  I,
  landlordAddressPage
) => {
  I.visitPage(landlordAddressPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  landlordAddressPage
) => {
  I.seeElements([
    landlordAddressPage.fields['landlord-building'],
    landlordAddressPage.fields['landlord-street'],
    landlordAddressPage.fields['landlord-townOrCity'],
    landlordAddressPage.fields['landlord-postcode']
  ]);
});

Scenario('I see an error if I submit the form without entering a building', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.fields['landlord-townOrCity'],
    landlordAddressPage.content['landlord-townOrCity']);
  I.fillField(landlordAddressPage.fields['landlord-postcode'],
    landlordAddressPage.content['landlord-postcode']);
  I.submitForm();
  I.seeErrors([
    landlordAddressPage.fields['landlord-building']
  ]);
});

Scenario('I see an error if I submit the form without entering a town or city', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.fields['landlord-building'],
    landlordAddressPage.content['landlord-building']);
  I.fillField(landlordAddressPage.fields['landlord-postcode'],
    landlordAddressPage.content['landlord-postcode']);
  I.submitForm();
  I.seeErrors([
    landlordAddressPage.fields['landlord-townOrCity']
  ]);
});

Scenario('I see an error if I submit the form without entering a postcode', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.fields['landlord-building'],
    landlordAddressPage.content['landlord-building']);
  I.fillField(landlordAddressPage.fields['landlord-townOrCity'],
    landlordAddressPage.content['landlord-townOrCity']);
  I.submitForm();
  I.seeErrors([
    landlordAddressPage.fields['landlord-postcode']
  ]);
});

Scenario('I see an error if I enter an invalid town or city', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.fields['landlord-townOrCity'],
    landlordAddressPage.content.invalidTownOrCity);
  I.submitForm();
  I.seeErrors(landlordAddressPage.fields['landlord-townOrCity']);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.fields['landlord-postcode'],
    landlordAddressPage.content.invalidPostcode);
  I.submitForm();
  I.seeErrors(landlordAddressPage.fields['landlord-postcode']);
});

Scenario('I am taken to the confirm page if I tick the use previous address checkbox', function *(
  I,
  landlordAddressPage,
  confirmPage
) {
  yield I.setSessionData(steps.name, {
    who: 'landlord'
  });
  yield I.refreshPage();
  I.checkOption(landlordAddressPage.fields.usePrevious);
  I.submitForm();
  I.seeInCurrentUrl(confirmPage.url);
});


Scenario('I am taken to the confirm page on a valid submission', (
  I,
  landlordAddressPage,
  confirmPage
) => {
  I.fillField(landlordAddressPage.fields['landlord-building'],
    landlordAddressPage.content['landlord-building']);
  I.fillField(landlordAddressPage.fields['landlord-townOrCity'],
    landlordAddressPage.content['landlord-townOrCity']);
  I.fillField(landlordAddressPage.fields['landlord-postcode'],
    landlordAddressPage.content['landlord-postcode']);
  I.submitForm();
  I.seeInCurrentUrl(confirmPage.url);
});
