'use strict';

const PDFBase = require('./upload-pdf-new');

module.exports = superclass => class extends superclass {
  async successHandler(req, res, next) {
    try {
      const pdfBase = new PDFBase({
        sortSections: true
      });

      await pdfBase.send(req, res, super.locals(req, res));

      req.log('info', 'ukviet.submit_form.successful');
      return super.successHandler(req, res, next);
    } catch (err) {
      req.log('error', 'ukviet.submit_form.error', err.message || err);
      return next(err);
    }
  }
};
