'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const loader = require('lib/wiring/loader');

const init = (app) => {
  app.use(favicon(path.join(app.get('root'), 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(app.get('root'), 'public')));
};

const middleware = loader(__filename);
middleware.init = init;

module.exports = middleware;
