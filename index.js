'use strict';

const bootstrap = require('hof-bootstrap');

bootstrap({
  translations: './apps/end-tenancy/translations',
  views: false,
  fields: false,
  routes: [
    require('./apps/end-tenancy')
  ]
});
