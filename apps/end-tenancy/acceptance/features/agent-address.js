'use strict';

const steps = require('../../');

Feature('Agent Address');

Before((
  I,
  agentAddressPage
) => {
  I.visitPage(agentAddressPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  agentAddressPage
) => {
  I.seeElements(agentAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I submit the form without entering a postcode', (
  I,
  agentAddressPage
) => {
  I.submitForm();
  I.seeErrors(agentAddressPage.postcode.fields.postcode);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.postcode.fields.postcode,
    agentAddressPage.postcode.content.invalid);
  I.submitForm();
  I.seeErrors(agentAddressPage.postcode.fields.postcode);
});

Scenario('I am taken to the address step if the postcode isn\'t found', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.postcode.fields.postcode,
    agentAddressPage.postcode.content.notFound);
  I.submitForm();
  I.seeInCurrentUrl(agentAddressPage.address.url);
  I.seeElement(agentAddressPage.address.failedMessage);
});

Scenario('I am taken to the /lookup step if I enter a valid postcode', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.postcode.fields.postcode,
    agentAddressPage.postcode.content.valid);
  I.submitForm();
  I.seeInCurrentUrl(agentAddressPage.lookup.url);
});

Scenario('I am taken to the /address substep if I submit a Belfast postcode', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.postcode.fields.postcode,
    agentAddressPage.postcode.content.belfast);
  I.submitForm();
  I.seeInCurrentUrl(agentAddressPage.address.url);
});

Scenario('I see an error if I try and continue without selecting an address', (
  I,
  agentAddressPage
) => {
  agentAddressPage.enterValidPostcode();
  I.submitForm();
  I.seeErrors(agentAddressPage.lookup.fields['address-select']);
});

Scenario('I am taken to the manual entry step if I click the cant-find link', (
  I,
  agentAddressPage
) => {
  agentAddressPage.enterValidPostcode();
  I.click(agentAddressPage.links['cant-find']);
  I.seeInCurrentUrl(agentAddressPage.manual.url);
});

Scenario('I see an error if I sumbit the manual step without completing', (
  I,
  agentAddressPage
) => {
  agentAddressPage.enterValidPostcode();
  I.click(agentAddressPage.links['cant-find']);
  I.submitForm();
  I.seeErrors(agentAddressPage.manual.fields.address);
});

Scenario('I am taken to the landlord name step if I fill in the manual address field and submit', (
  I,
  agentAddressPage,
  landlordNamePage
) => {
  agentAddressPage.enterValidPostcode();
  I.click(agentAddressPage.links['cant-find']);
  I.fillField(agentAddressPage.manual.fields.address,
    agentAddressPage.address.content);
  I.submitForm();
  I.seeInCurrentUrl(landlordNamePage.url);
});

Scenario('I am taken to the postcode step if I click the change-postcode link', (
  I,
  agentAddressPage
) => {
  agentAddressPage.enterValidPostcode();
  I.click(agentAddressPage.links['change-postcode']);
  I.seeInCurrentUrl(agentAddressPage.postcode.url);
});

Scenario('I am taken to the landlord name step if I select a valid address', (
  I,
  agentAddressPage,
  landlordNamePage
) => {
  agentAddressPage.enterValidPostcode();
  I.selectOption(agentAddressPage.lookup.fields['address-select'],
    agentAddressPage.lookup.content['address-select']);
  I.submitForm();
  I.seeInCurrentUrl(landlordNamePage.url);
});

Scenario('I am taken to the landlord name page on a valid submission', (
  I,
  agentAddressPage,
  landlordNamePage
) => {
  agentAddressPage.selectAddressAndSubmit();
  I.submitForm();
  I.seeInCurrentUrl(landlordNamePage.url);
});
