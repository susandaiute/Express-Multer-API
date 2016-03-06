'use strict';

// const fs = require('fs');
// const path = require('path');
// const thisFile = path.basename(module.filename);
// const models = {};
//
// fs.readdirSync(__dirname).filter(entry =>
//   !fs.statSync(path.join(__dirname, entry)).isDirectory() &&
//   thisFile !== entry
//   ).forEach(entry =>
//     models[path.parse(entry).name] = require(`./${entry}`)
//   );

const loader = require('lib/wiring/loader');

module.exports = loader(__filename);
