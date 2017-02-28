/* eslint-disable no-underscore-dangle */

'use strict';

const _ = require('lodash');

module.exports = superclass => class extends superclass {

  configure(req, res, callback) {
    Object.assign(req.form.options, {
      customerEmailField: req.sessionModel.get('who') === 'landlord' ?
        'landlord-email-address' :
        'agent-email-address'
    });
    super.configure(req, res, callback);
  }

  parseSections(req) {
    const result = super.parseSections(req);
    const section = this.addLoopSection(req);
    result.splice(1, 0, section);
    return result;
  }

  addLoopSection(req) {
    const loopStep = req.form.options.steps['/tenant-details'];
    const tenants = req.sessionModel.get(loopStep.storeKey);

    const includeField = (value, field) => {
      return req.form.options.sections['tenants-left'].map(f =>
        (typeof f === 'object') ? f.field : f
      ).indexOf(field) > -1;
    };

    const formatValue = (value, field) => {
      const fieldConfig = req.form.options.sections['tenants-left'].find(f =>
        f === field || f.field === field
      );
      if (typeof fieldConfig === 'string') {
        return value;
      }
      return fieldConfig.parse ? fieldConfig.parse(value) : value;
    };

    const getSubStep = (field, subSteps) =>
      _.findKey(subSteps, subStep => subStep.fields.indexOf(field) > -1);

    let _id;

    const fields = _.flatten(
      _.map(tenants, (tenant, id) =>
        _.map(
          _.pickBy(tenant, includeField), (value, field) => ({
            field,
            className: _id !== id ? (_id = id) && 'tenant' : '',
            value: formatValue(value, field),
            step: `/tenant-details/${getSubStep(field, loopStep.subSteps)}/${id}`,
            label: req.translate([
              `pages.confirm.fields.${field}.label`,
              `fields.${field}.summary`,
              `fields.${field}.label`,
              `fields.${field}.legend`
            ])
          }))
      )
    );

    return {
      section: req.translate('pages.tenants-left.header'),
      fields
    };
  }
};
