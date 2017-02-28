'use strict';

module.exports = config => superclass => class extends superclass {
  configure(req, res, callback) {
    if (req.params.action !== 'postcode') {
      super.configure(req, res, callback);
    } else {
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
  }

  process(req, res, callback) {
    if (req.form.values['use-previous-address'] === 'true') {
      req.sessionModel.set(this.options.addressKey, req.sessionModel.get(config.previousAddress));
      this.successHandler(req, res);
    } else {
      super.process(req, res, callback);
    }
  }

  getNextStep(req, res, callback) {
    if (req.form.values['use-previous-address'] === 'true') {
      return this.options.next;
    }
    return super.getNextStep(req, res, callback);
  }
};
