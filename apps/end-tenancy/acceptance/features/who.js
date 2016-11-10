'use strict';

const steps = require('../../');

Feature('Who are you step');

Before((
  I,
  whoPage
) => {
  I.visitPage(whoPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  whoPage
) => {
  I.seeElements(whoPage.fields.who);
});

Scenario('I see an error if I click submit without selecting an option', (
  I,
  whoPage
) => {
  I.submitForm();
  I.seeErrors(whoPage.fields.who);
});

Scenario('I am taken to the landlords details page if I select "landlord"', (
  I,
  whoPage,
  landlordDetailsPage
) => {
  I.checkOption(whoPage.fields.landlord);
  I.submitForm();
  I.seeInCurrentUrl(landlordDetailsPage.url);
});


Scenario('I am taken to the agent details page if I select "agent"', (
  I,
  whoPage,
  agentDetailsPage
) => {
  I.checkOption(whoPage.fields.agent);
  I.submitForm();
  I.seeInCurrentUrl(agentDetailsPage.url);
});
