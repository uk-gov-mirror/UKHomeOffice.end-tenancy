'use strict';

module.exports = superclass => class extends superclass {
  getNextStep(req, res) {
    this.confirmStep = req.sessionModel.get('what') === 'request' ? '/confirm' : '/confirm-declaration';
    return super.getNextStep(req, res);
  }
};
