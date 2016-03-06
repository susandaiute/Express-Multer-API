'use strict';

const controller = (actions, options) =>
  Object.keys(actions).reduce((m, k) => {
    m[k] = [actions[k]];
    return m;
  }, {});

module.exports = controller;
