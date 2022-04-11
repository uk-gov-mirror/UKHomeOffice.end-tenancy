const fs = require('fs');
const path = require('path');
const moment = require('moment');
const config = require('../../../config');
const utils = require('../../../lib/utils');
const _ = require('lodash');
const PDFModel = require('hof').apis.pdfConverter;
const FileVaultModel = utils.FileVaultModel;

module.exports = class UploadPDF {
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

  async save(req, res, locals) {
    try {
      const html = await this.renderHTML(req, res, locals);

      const pdfModel = new PDFModel();
      pdfModel.set({ template: html });

      const pdfData = await pdfModel.save();

      const result = await this.uploadFileVault({
        name: 'application_form.pdf',
        data: pdfData,
        mimetype: 'application/pdf'
      });

      req.log('info', 'ukviet.upload_pdf.filevault.successful');
      return { pdfData, fvLink: result.url };
    } catch (err) {
      req.log('error', 'ukviet.upload_pdf.filevault.error', err.message || err);
      throw err;
    }
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
