const { Given, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const expect = require('chai').expect;
const World = require('../test.setup.js');
const config = require('../../../config');

setDefaultTimeout(10 * 1000);

const domain = config.hosts.acceptanceTests;

const sleep = ms => new Promise(r => setTimeout(r, ms));

Given('I start a {string}', async function (route) {
  this.route = route;
  await this.page.goto(`${domain}`);
  await this.page.click(`#what-${route}`);
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I fill {string} with {string}', async function (field, value) {
  await this.page.fill(`#${field}`, value);
}.bind(World));

Then('I fill the address fields with correct information', async function () {
  await this.page.fill('#building', 'building');
  await this.page.fill('#street', 'street');
  await this.page.fill('#townOrCity', 'town');
  await this.page.fill('#postcode', 'CR02EU');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I fill the {string} address fields with correct information', async function (address) {
  await this.page.fill(`#${address}-building`, 'building');
  await this.page.fill(`#${address}-street`, 'street');
  await this.page.fill(`#${address}-townOrCity`, 'town');
  await this.page.fill(`#${address}-postcode`, 'CR02EU');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I fill the {string} date', async function (field) {
  await this.page.fill(`#${field}-day`, '1');
  await this.page.fill(`#${field}-month`, '2');
  await this.page.fill(`#${field}-year`, '2015');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I use the same address as previously provided', async function () {
  await this.page.click('#use-previous-address');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I add a tenant with full information', async function () {
  await this.page.fill('#name', 'test');
  await this.page.click('input[type="submit"]');
  await this.page.click('#tenant-details-date-of-birth');
  await this.page.fill('#date-of-birth-day', '1');
  await this.page.fill('#date-of-birth-month', '1');
  await this.page.fill('#date-of-birth-year', '1990');
  await this.page.click('#tenant-details-nationality');
  await this.page.fill('#nationality', 'United Kingdom');
  await this.page.click('#tenant-details-reference-number');
  await this.page.fill('#reference-number', 'A12345');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I do not add another tenant', async function () {
  await this.page.click('#add-another-no');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I add another tenant', async function () {
  await this.page.click('#add-another-yes');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I set the user as {string}', async function (who) {
  await this.page.click(`#who-${who}`);
  await this.page.click('input[type="submit"]');
  await this.page.fill(`#${who}-name`, 'test');
  await this.page.fill(`#${who}-company`, 'company');
  await this.page.fill(`#${who}-email-address`, 'sas-hof-test@digital.homeoffice.gov.uk');
  await this.page.fill(`#${who}-phone-number`, '07123456789');
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I submit the page', async function () {
  await this.page.click('input[type="submit"]');
}.bind(World));

Then('I confirm the declaration', async function () {
  await this.page.click('#declaration');
}.bind(World));

Then('I submit the application', async function () {
  await this.page.click('input[type="submit"]');
  await sleep(5000);
}.bind(World));

Then('I click the {string} button', async function (button) {
  await this.page.click(`text=${button}`);
}.bind(World));

Then('I should be on the {string} page with title {string}', async function (page, title) {
  await this.page.waitForSelector('body', { timeout: 15000 });
  expect(new URL(await this.page.url()).pathname).to.eql(`/${page}`);
  expect(await this.page.innerText('body')).to.include(title);
}.bind(World));

Then('I should be on the {string} page', async function (page) {
  expect(new URL(await this.page.url()).pathname).to.eql(`/${page}`);
}.bind(World));
