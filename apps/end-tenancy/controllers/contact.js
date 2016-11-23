'use strict';

const BaseController = require('hof-controllers').base;

module.exports = class ContactController extends BaseController {
  locals(req, res) {
    const content = req.rawTranslate('content.contact');
    return Object.assign({}, super.locals(req, res), {
      content
    });
  }
};
