'use strict';

const steps = require('../../');

Feature('Landlord Address');

Before((
  I,
  landlordAddressPage
) => {
  I.visitPage(landlordAddressPage, steps);
});

Scenario('I see the use previous checkbox if I am the landlord', function *(
  I,
  landlordAddressPage
) {
  yield I.setSessionData(steps.name, {
    who: 'landlord'
  });
  yield I.refreshPage();
  I.seeElements(landlordAddressPage.postcode.fields.usePrevious);
});

Scenario('I see an error if I submit the form without entering a postcode', (
  I,
  landlordAddressPage
) => {
  I.submitForm();
  I.seeErrors(landlordAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.postcode.fields.postcode,
    landlordAddressPage.postcode.content.invalid);
  I.submitForm();
  I.seeErrors(landlordAddressPage.postcode.fields.postcode);
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
  I.checkOption(landlordAddressPage.postcode.fields.usePrevious);
  I.submitForm();
  I.seeInCurrentUrl(confirmPage.url);
});

Scenario('I am taken to the address step if the postcode isn\'t found', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.postcode.fields.postcode,
    landlordAddressPage.postcode.content.notFound);
  I.submitForm();
  I.seeInCurrentUrl(landlordAddressPage.address.url);
  I.seeElement(landlordAddressPage.address.failedMessage);
});

Scenario('I am taken to the /lookup step if I enter a valid postcode', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.postcode.fields.postcode,
    landlordAddressPage.postcode.content.valid);
  I.submitForm();
  I.seeInCurrentUrl(landlordAddressPage.lookup.url);
});

Scenario('I am taken to the /address substep if I submit a Belfast postcode', (
  I,
  landlordAddressPage
) => {
  I.fillField(landlordAddressPage.postcode.fields.postcode,
    landlordAddressPage.postcode.content.belfast);
  I.submitForm();
  I.seeInCurrentUrl(landlordAddressPage.address.url);
});

Scenario('I see an error if I try and continue without selecting an address', (
  I,
  landlordAddressPage
) => {
  landlordAddressPage.enterValidPostcode();
  I.submitForm();
  I.seeErrors(landlordAddressPage.lookup.fields['address-select']);
});

Scenario('I am taken to the manual entry step if I click the cant-find link', (
  I,
  landlordAddressPage
) => {
  landlordAddressPage.enterValidPostcode();
  I.click(landlordAddressPage.links['cant-find']);
  I.seeInCurrentUrl(landlordAddressPage.manual.url);
});

Scenario('I see an error if I sumbit the manual step without completing', (
  I,
  landlordAddressPage
) => {
  landlordAddressPage.enterValidPostcode();
  I.click(landlordAddressPage.links['cant-find']);
  I.submitForm();
  I.seeErrors(landlordAddressPage.manual.fields.address);
});

Scenario('I am taken to the confirm step if I fill in the manual address field and submit', (
  I,
  landlordAddressPage,
  confirmPage
) => {
  landlordAddressPage.enterValidPostcode();
  I.click(landlordAddressPage.links['cant-find']);
  I.fillField(landlordAddressPage.manual.fields.address,
    landlordAddressPage.address.content);
  I.submitForm();
  I.seeInCurrentUrl(confirmPage.url);
});

Scenario('I am taken to the postcode step if I click the change-postcode link', (
  I,
  landlordAddressPage
) => {
  landlordAddressPage.enterValidPostcode();
  I.click(landlordAddressPage.links['change-postcode']);
  I.seeInCurrentUrl(landlordAddressPage.postcode.url);
});

Scenario('I am taken to the confirm step if I select a valid address', (
  I,
  landlordAddressPage,
  confirmPage
) => {
  landlordAddressPage.enterValidPostcode();
  I.selectOption(landlordAddressPage.lookup.fields['address-select'],
    landlordAddressPage.lookup.content['address-select']);
  I.submitForm();
  I.seeInCurrentUrl(confirmPage.url);
});

Scenario('I am taken to the confirm page on a valid submission', (
  I,
  landlordAddressPage,
  confirmPage
) => {
  landlordAddressPage.selectAddressAndSubmit();
  I.submitForm();
  I.seeInCurrentUrl(confirmPage.url);
});
