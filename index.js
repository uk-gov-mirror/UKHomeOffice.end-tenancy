'use strict';

/* eslint no-process-env: 0*/
const bootstrap = require('hof');
const config = require('./config');

const options = {
  routes: [
    require('./apps/end-tenancy')
  ],
  getCookies: false,
  getTerms: false,
  redis: config.redis
};

if (process.env.NODE_ENV !== 'production') {
  options.middleware = [require('./mocks')];
}

bootstrap(options);
