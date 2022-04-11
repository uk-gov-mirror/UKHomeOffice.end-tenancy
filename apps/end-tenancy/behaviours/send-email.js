'use strict';

const _ = require('lodash');
const config = require('../../../config');
const utils = require('../../../lib/utils');
const UploadPDF = require('../models/upload-pdf');
const NotifyClient = utils.NotifyClient;
const notifyKey = config.notify.apiKey;

module.exports = superclass => class extends superclass {
  async successHandler(req, res, next) {
    if (notifyKey === 'USE_MOCK') {
      req.log('warn', '*** Notify API Key set to USE_MOCK. Ensure disabled in production! ***');
      return super.successHandler(req, res, next);
    }

    try {
      const uploadPDF = new UploadPDF({ sortSections: true });

      const result = await uploadPDF.save(req, res, super.locals(req, res));

      await this.sendCaseworkerEmailWithAttachment(req, result.fvLink);
      await this.sendCustomerEmailWithAttachment(req, result.pdfData);

      req.log('info', 'ukviet.submit_form.successful');
      return super.successHandler(req, res, next);
    } catch (err) {
      req.log('error', 'ukviet.submit_form.error', err.message || err);
      return next(err);
    }
  }

  async sendCaseworkerEmailWithAttachment(req, fvLink) {
    const caseworkerEmail = config.notify.caseworkerEmail;
    const route = req.sessionModel.get('what');
    const title = `A ${route} has been sent`;

    try {
      const notifyClient = new NotifyClient(notifyKey);

      await notifyClient.sendEmail(config.notify.templateCaseworker, caseworkerEmail, {
        personalisation: {
          title,
          'form id': fvLink
        }
      });
      return req.log('info', 'ukviet.submit_form.create_email_with_file_notify.successful');
    } catch (err) {
      const error = _.get(err, 'response.data.errors[0]', err.message || err.data || err);
      req.log('error', 'ukviet.submit_form.create_email_with_file_notify.error', error);
      throw new Error(error);
    }
  }

  async sendCustomerEmailWithAttachment(req, pdfData) {
    const applicantEmail = req.sessionModel.get('landlord-email-address')
      || req.sessionModel.get('agent-email-address');

    const route = req.sessionModel.get('what');
    const title = `Your ${route} has been sent`;

    try {
      const notifyClient = new NotifyClient(notifyKey);

      await notifyClient.sendEmail(config.notify.templateCustomer, applicantEmail, {
        personalisation: {
          title,
          'form id': notifyClient.prepareUpload(pdfData)
        }
      });
      req.log('info', 'ukviet.send_customer_email.create_email_notify.successful');
    } catch (err) {
      const error = _.get(err, 'response.data.errors[0]', err.message || err.data || err);
      req.log('error', 'ukviet.send_customer_email.create_email_notify.error', err.message || err);
      throw new Error(error);
    }
  }
};
