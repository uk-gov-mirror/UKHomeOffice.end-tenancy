'use strict';

const BaseController = require('hof-controllers').base;

module.exports = class ConfirmationController extends BaseController {
  locals(req, res) {
    return Object.assign({}, super.locals(req, res), {
      emailAddress: req.sessionModel.get('who') === 'landlord' ?
        req.sessionModel.get('landlord-email-address') :
        req.sessionModel.get('agent-email-address'),
      report: req.sessionModel.get('what') === 'report',
      check: req.sessionModel.get('what') === 'check'
    });
  }

  render(req, res, callback) {
    req.sessionModel.reset();
    super.render(req, res, callback);
  }
};
