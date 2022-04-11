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
const FileVaultModel = apiKey === 'USE_MOCK' ? MockFileVault : require('../apps/end-tenancy/models/upload');

module.exports = {
  NotifyClient,
  FileVaultModel
};
