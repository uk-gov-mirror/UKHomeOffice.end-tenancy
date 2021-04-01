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

const addGenericLocals = (req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.feedbackUrl = '/feedback';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/terms-and-conditions', property: 'base.terms' },
    { path: '/accessibility', property: 'base.accessibility' },
  ];
  return next();
};

if (process.env.NODE_ENV !== 'production') {
  options.middleware = [require('./mocks')];
}

const app = bootstrap(options);

app.use((req, res, next) => addGenericLocals(req, res, next));
app.use('/terms-and-conditions', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('terms'));
  next();
});
app.use('/cookies', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('cookies'));
  next();
});
