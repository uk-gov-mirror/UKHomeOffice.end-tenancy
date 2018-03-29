'use strict';

/* eslint no-process-env: 0*/
const hof = require('hof');
const config = require('./config');

const options = {
  start: false,
  routes: [
    require('./apps/end-tenancy')
  ],
  getCookies: false,
  getTerms: false,
  redis: config.redis
};

const app = hof(options);

if (process.env.NODE_ENV !== 'production') {
  app.use(require('./mocks'));
}

module.exports = app;
