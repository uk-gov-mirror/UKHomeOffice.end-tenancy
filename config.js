'use strict';

/* eslint no-process-env: 0 */
const env = process.env.NODE_ENV || 'production';
const localhost = () => `${process.env.LISTEN_HOST || '0.0.0.0'}:${process.env.PORT || 8080}`;

module.exports = {
  env,
  DATE_FORMAT: 'YYYY-MM-DD',
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:MM:SS ZZ',
  notify: {
    apiKey: process.env.NOTIFY_STUB === 'true' ? 'USE_MOCK' : process.env.NOTIFY_KEY,
    caseworkerEmail: process.env.CASEWORKER_EMAIL,
    templateCaseworker: process.env.TEMPLATE_CASEWORKER,
    templateCustomer: process.env.TEMPLATE_CUSTOMER
  },
  redis: {
    password: process.env.REDIS_PASSWORD
  },
  pdf: {
    mock: '/api/pdf-converter',
    hostname: (!env || env === 'ci') ? `http://${localhost()}/api/pdf-converter` : process.env.PDF_CONVERTER_URL
  },
  upload: {
    mock: '/api/file-upload',
    hostname: (!env || env === 'ci') ? `http://${localhost()}/api/file-upload` : process.env.FILE_VAULT_URL
  },
  keycloak: {
    tokenUrl: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET
  },
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  }
};
