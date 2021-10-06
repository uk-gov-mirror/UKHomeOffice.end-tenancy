'use strict';

module.exports = config => superclass => class extends superclass {
  configure(req, res, callback) {
    super.configure(req, res, err => {
      Object.assign(req.form.options.fields, {
        'use-previous-address': {
          mixin: 'checkbox',
          className: 'label',
          useWhen: config.useWhen
        }
      });
      callback(err);
    });
  }

  process(req, res, callback) {
    if (req.form.values['use-previous-address'] === 'true') {
      req.sessionModel.set(this.options.buildingKey, req.sessionModel.get(config.previousBuilding));
      req.sessionModel.set(this.options.streetKey, req.sessionModel.get(config.previousStreet));
      req.sessionModel.set(this.options.townKey, req.sessionModel.get(config.previousTown));
      req.sessionModel.set(this.options.postcodeKey, req.sessionModel.get(config.previousPostcode));
      this.successHandler(req, res);
    } else {
      super.process(req, res, callback);
    }
  }

  // getNextStep(req, res, callback) {
  //   if (req.form.values['use-previous-address'] === 'true') {
  //     return this.options.next;
  //   }
  //   return super.getNextStep(req, res, callback);
  // }
};
