'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  token: {
    type: String,
    require: true,
  },
  passwordDigest: String,
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

userSchema.methods.comparePassword = function (password) {
  let passwordDigest = this.passwordDigest;

  return new Promise((resolve, reject) =>
    bcrypt.compare(password, passwordDigest, (err, data) =>
        err ? reject(err) : resolve(data)));
};

userSchema.methods.setPassword = function (password) {
  var _this = this;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(16, (err, salt) =>
        err ? reject(err) : resolve(salt))
    .then((salt) =>
      new Promise((resolve, reject) =>
        bcrypt.hash(password, salt, (err, data) =>
          err ? reject(err) : resolve(data))))
    .then((digest) => {
      _this.passwordDigest = digest;
      return _this.save();
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
