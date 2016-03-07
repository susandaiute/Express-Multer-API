'use strict';

const debug = require('debug')('express-template:users');

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
  let decrypted = signedSecureToken;

  // let split = signedSecureToken.split('--');
  // let decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY_BASE);
  // let hash = crypto.createHash('sha256');
  // hash.update(split[0]);
  // let hashed = hash.digest('base64');
  // let decrypted;
  // if (hashed === split[1]) {
  //   decrypted = decipher.update(split[0], 'base64', 'utf8');
  //   decrypted += decipher.final('utf8');
  // }

  return decrypted;
};

const getToken = () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(16, (err, data) =>
      err ? reject(err) : resolve(data.toString('base64'))
    )
  );

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
        req.currentUser = user.toObject();
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

const userFilter = { passwordDigest: 0, token: 0 };

const index = (req, res, next) => {
  User.find({}, userFilter).exec()
    .then(users => res.json({ users }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  User.findById(req.params.id, userFilter).exec()
    .then(user => user ? res.json({ user }) : next())
    .catch(err => next(err));
};

const signup = (req, res, next) => {
  let credentials = req.body.credentials;
  let user = { email: credentials.email };
  getToken().then(token =>
    user.token = token
  ).then(() =>
    new User(user).setPassword(credentials.password)
  ).then(newUser => {
    let user = newUser.toObject();
    delete user.token;
    delete user.passwordDigest;
    res.json({ user });
  }).catch(err =>
    next(err)
  );

};

const signin = (req, res, next) => {
  let credentials = req.body.credentials;
  let search = { email: credentials.email };
  User.findOne(search
  ).then(user =>
    user.comparePassword(credentials.password)
  ).then(user =>
    getToken().then(token => {
      user.token = token;
      return user.save();
    })
  ).then(user => {
    user = user.toObject();
    delete user.passwordDigest;
    res.json({ user });
  }).catch(err =>
    next(err)
  );
};

const signout = (req, res, next) => {
  getToken().then(token =>
    User.findOneAndUpdate({
      _id: req.params.id,
      token: req.currentUser.token,
    }, {
      token,
    })
  ).then((user) =>
    user ? res.sendStatus(200) : next()
  ).catch(next);
};

const changepw = (req, res, next) => {
  debug('Changing password');
  User.findOne({
    _id: req.params.id,
    token: req.currentUser.token,
  }).then(user =>
    user ? user.comparePassword(req.body.passwords.old) :
      Promise.reject(new Error('Not found'))
  ).then(user =>
    user.setPassword(req.body.passwords.old)
  ).then((/* user */) =>
    res.sendStatus(200)
  ).catch(err => {
    if (err.message === 'Not Found') {
      err.status = 404;
    }

    next(err);
  });
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
