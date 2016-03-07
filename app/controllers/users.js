'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const User = models.user;

const crypto = require('crypto');

const encodeToken = (token)  => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.SECRET_KEY_BASE);
  let encrypted = cipher.update(token, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  let hash = crypto.createHash('sha256');
  hash.update(encrypted);
  let hashed = hash.digest('base64');
  let signedSecureToken = encrypted + '--' + hashed;
  return signedSecureToken;
};

const decodeToken = (signedSecureToken) => {
  let split = signedSecureToken.split('--');
  let decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY_BASE);
  let hash = crypto.createHash('sha256');
  hash.update(split[0]);
  let hashed = hash.digest('base64');
  let decrypted;
  if (hashed === split[1]) {
    decrypted = decipher.update(split[0], 'base64', 'utf8');
    decrypted += decipher.final('utf8');
  }

  return decrypted;
};

const authenticate = (req, res, next) => {
  const tokenRegex = /^Token token=/;
  const separatorRegex = /\s*(?::|;|\t+)\s*/;
  let auth = req.headers.authorization;
  if (auth && tokenRegex.test(auth)) {
    let opts = auth.replace(tokenRegex, '').split(separatorRegex);
    let signedToken = opts.shift();
    let token = decodeToken(signedToken);
    User.findOne({ token })
    .then(user => {
      if (user) {
        req.user = user.toObject();
        return next();
      }

      res.set('WWW-Authenticate', 'Token realm="Application"');
      res.status(401).send('HTTP Token: Access denied.\n');
    })
    .catch(err => next(err));
  } else {
    res.set('WWW-Authenticate', 'Token realm="Application"');
    res.status(401).send('HTTP Token: Access denied.\n');
  }
};

const index = (req, res, next) => {
  User.find().exec()
    .then(users => res.json({ users }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  User.findById(req.params.id).exec()
    .then(user => user ? res.json({ user }) : next())
    .catch(err => next(err));
};

const signup = (req, res, next) => {
  next();
};

const signin = (req, res, next) => {
  next();
};

const signout = (req, res, next) => {
  next();
};

const changepw = (req, res, next) => {
  next();
};

module.exports = controller({
  index,
  show,
  signup,
  signin,
  signout,
  changepw,
}, { before: [
  { method: authenticate, except: ['signup', 'signin'] },
], });
