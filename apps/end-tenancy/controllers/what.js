'use strict';

const BaseController = require('hof-controllers').base;

module.exports = class WhatController extends BaseController {
  process(req, res, cb) {
    if (req.params.action === 'edit'
      && req.sessionModel.get('what') !== req.form.values.what
    ) {
      req.sessionModel.set('changed', true);
      req.sessionModel.unset('tenants');
    }
    super.process(req, res, cb);
  }

  getNextStep(req, res) {
    let next = super.getNextStep(req, res);
    if (req.sessionModel.get('changed')) {
      next = next.replace(/\/edit/, '');
      req.sessionModel.unset('changed');
    }
    return next;
  }
};
