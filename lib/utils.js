'use strict';

const config = require('../config');
const apiKey = config.notify.apiKey;

class MockNotify {
  sendEmail() {
    return Promise.resolve();
  }

  prepareUpload() {}
}

class MockFileVault {
  set() {}

  save() {
    return Promise.resolve();
  }
}

const NotifyClient = apiKey === 'USE_MOCK' ? MockNotify : require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(apiKey);

const FileVaultModel = apiKey === 'USE_MOCK' ? MockFileVault : require('../apps/end-tenancy/models/upload');

const sendEmail = (templateId, emailAddress, ref, data) => {
  return notifyClient.sendEmail(templateId, emailAddress, {
    personalisation: data,
    ref
  });
};

module.exports = {
  sendEmail,
  NotifyClient,
  FileVaultModel
};
