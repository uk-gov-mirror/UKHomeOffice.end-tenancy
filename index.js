'use strict';

const bootstrap = require('hof-bootstrap');
const config = require('./config');
const mockPostcode = require('./mock-postcode');

const options = {
  translations: './apps/end-tenancy/translations',
  views: false,
  fields: false,
  routes: [
    require('./apps/end-tenancy')
  ]
};

if (config.env === 'ci') {
  options.middleware = [
    mockPostcode
  ];
}

bootstrap(options);
