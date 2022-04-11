'use strict';

const hof = require('hof');
const config = require('./config');

let settings = require('./hof.settings');

settings = Object.assign({}, settings, {
  behaviours: settings.behaviours.map(require),
  routes: settings.routes.map(require),
  getCookies: false,
  getTerms: false,
  redis: config.redis
});

if (!config.env || config.env === 'ci') {
  settings.middleware = [require('./mocks')];
}

const app = hof(settings);

app.use((req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/privacy-policy', property: 'Privacy Policy' },
    { path: '/accessibility', property: 'base.accessibility' }
  ];
  return next();
});

app.use('/cookies', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('cookies'));
  next();
});

module.exports = app;
