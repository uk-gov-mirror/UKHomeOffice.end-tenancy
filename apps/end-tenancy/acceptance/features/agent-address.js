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
  I.seeElements([
    agentAddressPage.fields['agent-building'],
    agentAddressPage.fields['agent-street'],
    agentAddressPage.fields['agent-townOrCity'],
    agentAddressPage.fields['agent-postcode']
  ]);
});

Scenario('I see an error if I submit the form without entering a building', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.fields['agent-townOrCity'],
    agentAddressPage.content['agent-townOrCity']);
  I.fillField(agentAddressPage.fields['agent-postcode'],
    agentAddressPage.content['agent-postcode']);
  I.submitForm();
  I.seeErrors([
    agentAddressPage.fields['agent-building']
  ]);
});

Scenario('I see an error if I submit the form without entering a town or city', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.fields['agent-building'],
    agentAddressPage.content['agent-building']);
  I.fillField(agentAddressPage.fields['agent-postcode'],
    agentAddressPage.content['agent-postcode']);
  I.submitForm();
  I.seeErrors([
    agentAddressPage.fields['agent-townOrCity']
  ]);
});

Scenario('I see an error if I submit the form without entering a postcode', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.fields['agent-building'],
    agentAddressPage.content['agent-building']);
  I.fillField(agentAddressPage.fields['agent-townOrCity'],
    agentAddressPage.content['agent-townOrCity']);
  I.submitForm();
  I.seeErrors([
    agentAddressPage.fields['agent-postcode']
  ]);
});

Scenario('I see an error if I enter an invalid town or city', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.fields['agent-townOrCity'],
    agentAddressPage.content.invalidTownOrCity);
  I.submitForm();
  I.seeErrors(agentAddressPage.fields['agent-townOrCity']);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  agentAddressPage
) => {
  I.fillField(agentAddressPage.fields['agent-postcode'],
    agentAddressPage.content.invalidPostcode);
  I.submitForm();
  I.seeErrors(agentAddressPage.fields['agent-postcode']);
});

Scenario('I am taken to the landlord name page on a valid submission', (
  I,
  agentAddressPage,
  landlordNamePage
) => {
  I.fillField(agentAddressPage.fields['agent-building'],
    agentAddressPage.content['agent-building']);
  I.fillField(agentAddressPage.fields['agent-townOrCity'],
    agentAddressPage.content['agent-townOrCity']);
  I.fillField(agentAddressPage.fields['agent-postcode'],
    agentAddressPage.content['agent-postcode']);
  I.submitForm();
  I.seeInCurrentUrl(landlordNamePage.url);
});
