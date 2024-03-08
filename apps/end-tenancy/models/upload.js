/* eslint-disable node/no-deprecated-api */
'use strict';

const url = require('url');
const FormData = require('form-data');
const Model = require('hof').model;
const config = require('../../../config');
const debug = require('debug')('upload-model');
const axios = require('axios');

module.exports = class UploadModel extends Model {
  save() {
    return new Promise((resolve, reject) => {
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
      return this.request(reqConf, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    })
      .then(result => {
        return this.set({ url: result.url });
      })
      .then(() => {
        return this.unset('data');
      });
  }

  auth() {
    if (!config.keycloak.tokenUrl) {
      // eslint-disable-next-line no-console
      console.error('keycloak token url is not defined');
      return Promise.resolve({
        bearer: 'abc123'
      });
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
    debug('REQUEST DATA', tokenReq);
    return axios(tokenReq).then(response => {
      debug('RESPONSE FROM FILE VAULT', response);
      return { bearer: response.data.access_token };
    })
      .catch(err => {
        console.log(`Error: ${err.response.data.error} - ${err.response.data.error_description}`);
        throw err;
      });
  }
};
