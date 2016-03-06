'use strict';

const routes = require('lib/wiring/routes');

routes.root('root#root');
routes.resources('examples');

module.exports = routes;
