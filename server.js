'use strict'

const jsonApi = require('jsonapi-server');
const express = require('express');

const app = express();

const api = express.Router();

jsonApi.setConfig({
  router: api,
  graphiql: true,
});

const AuthenticationHandler = new jsonApi.ChainHandler();

AuthenticationHandler.beforeCreate = (request, callback) => {
  return callback(null, request);
};

AuthenticationHandler.afterCreate = (request, results, pagination, callback) => {
  return callback(null, results, pagination);
};

jsonApi.define({
  resource: 'organizations',
  handlers: AuthenticationHandler.chain(new jsonApi.MemoryHandler),
  attributes: {
    code: jsonApi.Joi.string().max(6).required()
      .description('Code to identify organization')
      .example('APC'),
    name: jsonApi.Joi.string().required()
      .description('Name of the organization')
      .example('Autoridad Panameña de Credito'),
  },
});

app.use('/',api);

jsonApi.start();
app.listen(8080);
