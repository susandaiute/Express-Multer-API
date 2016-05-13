'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');

const middleware = require('app/middleware');
const multer = middleware['multer'];

const awsS3Upload = require('lib/awsfile');

const Upload = models.upload;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({ uploads }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Upload.findById(req.params.id)
  // console.log(req.param)
    .then(upload => upload ? res.json({ upload }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let upload = {
    mime: req.file.mimeType,
    ext: ,
    data: req.file.buffer,
  };
  res.json({ upload });

  // Upload.create(upload)
  //   .then(upload => res.json({ upload }))
  //   .catch(err => next(err));
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Upload.findOne(search)
    .then(upload => {
      if (!upload) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return upload.update(req.body.upload)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Upload.findOne(search)
    .then(upload => {
      if (!upload) {
        return next();
      }

      return upload.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

module.exports = controller({
  index,
  //show,
  create,
  //update,
  //destroy,
}, { before: [
//  { method: authenticate, only: ['create'] },
    { method: multer.single('uploadFile'), only: ['create'] }
], });
