'use strict';

const hof = require('hof');
const config = require('./config');

let settings = require('./hof.settings');

settings = Object.assign({}, settings, {
  behaviours: settings.behaviours.map(require),
  routes: settings.routes.map(require),
  getCookies: false,
  getTerms: false,
  getAccessibility: false,
  redis: config.redis,
  csp: {
    imgSrc: [
      'www.google-analytics.com',
      'ssl.gstatic.com',
      'www.google.co.uk/ads/ga-audiences'
    ],
    connectSrc: [
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
      'https://region1.analytics.google.com'
    ]
  }
});

if (!config.env || config.env === 'ci') {
  settings.middleware = [require('./mocks')];
}

const app = hof(settings);

app.use((req, res, next) => {
  res.locals.htmlLang = 'en';
  // Set feedback url, required to display phase banner
  res.locals.feedbackUrl = config.feedbackUrl;
  res.locals.startPageRedirectUrl = config.startPageRedirectUrl;
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
