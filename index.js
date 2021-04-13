'use strict';

/* eslint no-process-env: 0*/
const hof = require('hof');
const config = require('./config');

const settings = {
  routes: [
    require('./apps/end-tenancy')
  ],
  getCookies: false,
  getTerms: false,
  redis: config.redis
};

const addGenericLocals = (req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/privacy-policy', property: 'Privacy Policy' }
  ];
  return next();
};

if (process.env.NODE_ENV !== 'production') {
  settings.middleware = [require('./mocks')];
}

const app = hof(settings);

app.use((req, res, next) => addGenericLocals(req, res, next));

app.use('/cookies', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('cookies'));
  next();
});

module.exports = app;
