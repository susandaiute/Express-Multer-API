'use strict';

const express = require('express');
const router = express.Router();

const controllers = require('app/controllers');

const root = (controllerAction) => {
  const split = controllerAction.split('#');
  let controllerName = split[0];
  let actionName = split[1];
  let apply = ['/'].concat(controllers[controllerName][actionName]);
  router.get.apply(router, apply);
};

const resources = (controller) => {
  const actions = [
    { path: `/${controller}`, method: 'get', name: 'index', },
    { path: `/${controller}/:id`, method: 'get', name: 'show', },
    { path: `/${controller}`, method: 'post', name: 'create', },
    { path: `/${controller}/:id`, method: 'patch', name: 'update', },
    { path: `/${controller}/:id`, method: 'delete', name: 'destroy', },
  ];
  actions.forEach(action => {
    let apply = [action.path].concat(controllers[controller][action.name]);
    router[action.method].apply(router, apply);
  });
};

module.exports = {
  root,
  resources,
  router,
};
