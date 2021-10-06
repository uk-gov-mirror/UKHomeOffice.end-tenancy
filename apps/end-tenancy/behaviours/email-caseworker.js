'use strict';

const Emailer = require('hof').components.emailer;
const path = require('path');
const moment = require('moment');
const _ = require('lodash');

const config = require('../../../config');

const obfuscate = str => str.replace(/./g, '*');

const getDataRows = (model, translate) => {
  const label = key => translate(`email.customer.fields.${key}.label`);
  const isAgent = model['agent-email-address'] !== undefined;
  const isNotRequest = model.what !== 'request';
  const propertyHasStreet = model.street !== undefined;
  const landlordHasStreet = model['landlord-street'] !== undefined;
  const agentHasStreet = model['agent-street'] !== undefined;
  return [
    {
      table: [
        {
          label: label('submitted'),
          value: moment().format(config.PRETTY_DATE_FORMAT)
        }, {
          label: label('what'),
          value: model.what
        },
        isNotRequest && {
          label: label('nldp-date'),
          value: moment(model['nldp-date']).format(config.PRETTY_DATE_FORMAT)
        }, {
          label: label('building'),
          value: model.building
        },
        propertyHasStreet && {
          label: label('street'),
          value: model.street
        }, {
          label: label('townOrCity'),
          value: model.townOrCity
        }, {
          label: label('postcode'),
          value: model.postcode
        },
        model['tenancy-start'] && {
          label: label('tenancy-start'),
          value: moment(model['tenancy-start']).format(config.PRETTY_DATE_FORMAT)
        }
      ]
    },
    {
      title: 'Tenant details',
      table: _.reduce(model.tenants, (fields, tenant, i) => fields.concat([
        { linebreak: i > 0 },
        {
          label: label('tenant-name'),
          value: tenant.name
        },
        tenant['date-left'] && {
          label: label('tenant-date-left'),
          value: moment(tenant['date-left']).format(config.PRETTY_DATE_FORMAT)
        },
        tenant['date-of-birth'] && {
          label: label('tenant-date-of-birth'),
          value: moment(tenant['date-of-birth']).format(config.PRETTY_DATE_FORMAT)
        },
        tenant.nationality && {
          label: label('tenant-nationality'),
          value: tenant.nationality
        },
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
        { label: label('landlord-building'), value: model['landlord-building'] },
        landlordHasStreet && { label: label('landlord-street'), value: model['landlord-street'] },
        { label: label('landlord-townOrCity'), value: model['landlord-townOrCity'] },
        { label: label('landlord-postcode'), value: model['landlord-postcode'] },
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
        { label: label('agent-building'), value: model['agent-building'] },
        agentHasStreet && { label: label('agent-street'), value: model['agent-street'] },
        { label: label('agent-townOrCity'), value: model['agent-townOrCity'] },
        { label: label('agent-postcode'), value: model['agent-postcode'] }
      ]
    }
  ].filter(Boolean);
};

module.exports = settings => {
  if (settings.transport !== 'stub' && !settings.from && !settings.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, settings, {
    transport: settings.from ? settings.transport : 'stub',
    recipient: settings.caseworker,
    subject: (model, translate) => translate('email.caseworker.subject'),
    template: path.resolve(__dirname, '../emails/caseworker.html'),
    parse: (model, translate) => Object.assign(model, { data: getDataRows(model, translate) })
  }));
};
