'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');
const moment = require('moment');
const _ = require('lodash');

const config = require('../../../config');

const obfuscate = str => str.replace(/./g, '*');

const getDataRows = (model, translate) => {
  const label = key => translate(`email.customer.fields.${key}.label`);
  const isAgent = model['agent-email-address'] !== undefined;
  return [
    {
      table: [
        { label: label('submitted'), value: moment().format(config.dateTimeFormat) },
        { label: label('what'), value: model.what },
        { label: label('nldp-date'), value: model['nldp-date'] },
        { label: label('property-address'), value: model['property-address'] },
        model['tenancy-start'] && { label: label('tenancy-start'), value: model['tenancy-start'] }
      ]
    },
    {
      title: 'Tenant details',
      table: _.reduce(model.tenants, (fields, tenant, i) => fields.concat([
        { linebreak: i > 0 },
        { label: label('tenant-name'), value: tenant.name },
        tenant['date-left'] && {
          label: label('tenant-date-left'),
          value: moment(tenant['date-left']).format(config.dateFormat)
        },
        tenant['date-of-birth'] && {
          label: label('tenant-date-of-birth'),
          value: moment(tenant['date-of-birth']).format(config.dateFormat)
        },
        tenant.nationality && { label: label('tenant-nationality'), value: tenant.nationality },
        tenant['reference-number'] && {
          label: label('tenant-reference-number'),
          value: obfuscate(tenant['reference-number'])
        }
      ]), [])
    },
    {
      title: 'Landlord details',
      table: [
        { label: label('landlord-name'), value: model['landlord-name'] },
        !isAgent && { label: label('landlord-company'), value: model['landlord-company'] },
        !isAgent && { label: label('landlord-email-address'), value: model['landlord-email-address'] },
        !isAgent && { label: label('landlord-phone-number'), value: model['landlord-phone-number'] },
        { label: label('landlord-address'), value: model['landlord-address'] },
        { label: label('landlord-name-agent'), value: model['landlord-name-agent'] }
      ].filter(Boolean)
    },
    isAgent && {
      title: 'Agent details',
      table: [
        { label: label('agent-company'), value: model['agent-company'] },
        { label: label('agent-name'), value: model['agent-name'] },
        { label: label('agent-email-address'), value: model['agent-email-address'] },
        { label: label('agent-phone-number'), value: model['agent-phone-number'] },
        { label: label('agent-address'), value: model['agent-address'] }
      ]
    },
  ].filter(Boolean);
};

module.exports = settings => {
  if (settings.transport !== 'stub' && !settings.from && !settings.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, settings, {
    transport: settings.from ? settings.transport : 'stub',
    recipient: model => model['agent-email-address'] ? model['agent-email-address'] : model['landlord-email-address'],
    subject: (model, translate) => translate('email.customer.subject'),
    template: path.resolve(__dirname, '../emails/customer.html'),
    parse: (model, translate) => Object.assign(model, { data: getDataRows(model, translate) })
  }));
};
