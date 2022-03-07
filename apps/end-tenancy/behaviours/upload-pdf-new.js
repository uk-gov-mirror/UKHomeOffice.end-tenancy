const fs = require('fs');
const path = require('path');
const moment = require('moment');
const config = require('../../../config');
const utils = require('../../../lib/utils');
const _ = require('lodash');
const NotifyClient = utils.NotifyClient;
const PDFModel = require('hof').apis.pdfConverter;
const FileVaultModel = utils.FileVaultModel;

module.exports = class UploadPDFBase {
  constructor(behaviourConfig) {
    this.behaviourConfig = behaviourConfig;
  }

  readCss() {
    return new Promise((resolve, reject) => {
      const cssFile = path.resolve(__dirname, '../../../public/css/app.css');
      fs.readFile(cssFile, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  readHOLogo() {
    return new Promise((resolve, reject) => {
      const hoLogoFile = path.resolve(__dirname, '../../../assets/images/ho-logo.png');
      fs.readFile(hoLogoFile, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(`data:image/png;base64,${data.toString('base64')}`);
      });
    });
  }

  async renderHTML(req, res, locs) {
    let locals = locs;

    if (this.behaviourConfig.sortSections) {
      locals = this.sortSections(locs);
    }

    locals.dateTime = moment().format(config.dateTimeFormat);
    locals.values = req.sessionModel.toJSON();
    locals.htmlLang = res.locals.htmlLang || 'en';

    locals.css = await this.readCss(req);
    locals['ho-logo'] = await this.readHOLogo();
    return new Promise((resolve, reject) => {
      res.render('pdf.html', locals, (err, html) => err ? reject(err) : resolve(html));
    });
  }

  uploadFileVault(file) {
    const fileVaultModel = new FileVaultModel();
    fileVaultModel.set(file);
    return fileVaultModel.save();
  }

  async sendCaseworkerEmailWithAttachment(req, pdfData, fvLink) {
    const caseworkerEmail = config.notify.caseworkerEmail;
    const notifyKey = config.notify.apiKey;

    const route = req.sessionModel.get('what');
    const title = `A ${route} has been sent`;

    try {
      const notifyClient = new NotifyClient(notifyKey);

      if (notifyKey === 'USE_MOCK') {
        req.log('warn', '*** Notify API Key set to USE_MOCK. Ensure disabled in production! ***');
      }

      await notifyClient.sendEmail(config.notify.templatePDF, caseworkerEmail, {
        personalisation: Object.assign({}, {title: title}, {
          'form id': fvLink
        })
      });
      req.log('info', 'ukviet.submit_form.create_email_with_file_notify.successful');

      return await this.sendCustomerEmailWithAttachment(req, notifyClient, pdfData, route);
    } catch (err) {
      const error = _.get(err, 'response.data.errors[0]', err.message || err);
      req.log('error', 'ukviet.submit_form.create_email_with_file_notify.error', error);
      throw new Error(error);
    }
  }

  async sendCustomerEmailWithAttachment(req, notifyClient, pdfData, route) {
    const applicantEmail = req.sessionModel.get('landlord-email-address')
      ? req.sessionModel.get('landlord-email-address')
      : req.sessionModel.get('agent-email-address');

    const title = `Your ${route} has been sent`;

    try {
      await notifyClient.sendEmail(config.notify.templateCustomer, applicantEmail, {
        personalisation: Object.assign({}, {title: title}, {
          'form id': notifyClient.prepareUpload(pdfData)
        })
      });
      req.log('info', 'ukviet.send_customer_email.create_email_notify.successful');
    } catch (err) {
      req.log('error', 'ukviet.send_customer_email.create_email_notify.error', err.message || err);
      throw err;
    }
  }

  async send(req, res, locals) {
    const html = await this.renderHTML(req, res, locals);

    const pdfModel = new PDFModel();
    pdfModel.set({ template: html });
    const pdfData = await pdfModel.save();

    let fvLink;

    try {
      fvLink = await this.uploadFileVault({
        name: 'application_form.pdf',
        data: pdfData,
        mimetype: 'application/pdf'
      })
        .then(result => {
          return result.url;
        });

      req.log('info', 'ukviet.upload_pdf.filevault.successful');
    } catch (err) {
      req.log('error', 'ukviet.upload_pdf.filevault.error', err.message || err);
    }

    return await this.sendCaseworkerEmailWithAttachment(req, pdfData, fvLink);
  }

  sortSections(locals) {
    const translations = require('../../end-tenancy/translations/src/en/pages.json');
    const sectionHeaders = Object.values(translations.confirm.sections);
    const orderedSections = _.map(sectionHeaders, obj => obj.header);
    let rows = locals.rows;

    rows = rows.slice().sort((a, b) => orderedSections.indexOf(a.section) - orderedSections.indexOf(b.section));

    locals.rows = rows;
    return locals;
  }
};
