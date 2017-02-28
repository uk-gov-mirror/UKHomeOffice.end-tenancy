'use strict';

module.exports = superclass => class extends superclass {
  locals(req, res) {
    return Object.assign({}, super.locals(req, res), {
      emailAddress: req.sessionModel.get('who') === 'landlord' ?
        req.sessionModel.get('landlord-email-address') :
        req.sessionModel.get('agent-email-address')
    });
  }
};
