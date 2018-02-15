'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');

module.exports = settings => {
  if (settings.transportOptions.type !== 'stub' && !settings.from && !settings.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, settings, {
    transport: settings.from ? settings.transport : 'stub',
    recipient: settings.caseworker,
    subject: (model, translate) => translate('pages.email.caseworker.subject'),
    template: path.resolve(__dirname, '../emails/caseworker.html')
  }));
};
