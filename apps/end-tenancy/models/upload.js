/* eslint-disable node/no-deprecated-api */
'use strict';

const url = require('url');
const FormData = require('form-data');
const { model: Model } = require('hof');
const config = require('../../../config');
const logger = require('hof/lib/logger')({ env: config.env });

module.exports = class UploadModel extends Model {
  async save() {
    try {
      const attributes = {
        url: config.upload.hostname
      };
      const reqConf = url.parse(this.url(attributes));
      const formData = new FormData();
      formData.append('document', this.get('data'), {
        filename: this.get('name'),
        contentType: this.get('mimetype')
      });
      reqConf.data = formData;
      reqConf.method = 'POST';
      reqConf.headers = {
        ...formData.getHeaders()
      };
      logger.log('info', 'SAVE PDF DATA', reqConf);
      const response = await this.request(reqConf);
      logger.log('info', 'RESPONSE FROM FILE VAULT SAVE', response);

      await this.set({ url: response.url });
      await this.unset('data');

      return response;
    } catch (err) {
      logger.error('Error in save method ', err);
      throw err;
    }
  }

  async auth() {
    try {
      if (!config.keycloak.tokenUrl) {
        logger.error('keycloak token url is not defined');
        return {
          bearer: 'abc123'
        };
      }
      const tokenReq = {
        url: config.keycloak.tokenUrl,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          username: config.keycloak.username,
          password: config.keycloak.password,
          grant_type: 'password',
          client_id: config.keycloak.clientId,
          client_secret: config.keycloak.clientSecret
        },
        method: 'POST'
      };
      logger.log('info', 'REQUEST DATA', tokenReq);
      const response = await this._request(tokenReq);
      logger.log('info', 'RESPONSE FROM FILE VAULT', response);
      return { bearer: response.data.access_token };
    } catch (err) {
      logger.error(`Error in auth method: ${err.response?.data?.error} - ${err.response?.data?.error_description}`);
      throw err;
    }
  }
};
