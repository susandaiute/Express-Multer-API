'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const index = (req, res, next) => {
  Example.find().exec()
    .then(examples => res.json({ examples }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Example.findById(req.params.id).exec()
    .then(example => example ? res.json({ example }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  Example.create(req.body.example)
    .then(example => res.json({ example }))
    .catch(err => next(err));
};

const update = (req, res, next) => {
  Example.findById(req.params.id).exec()
    .then(example => {
      if (!example) {
        return next();
      }

      return example.update(req.body.example)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  Example.findById(req.params.id).exec()
    .then(example => {
      if (!example) {
        return next();
      }

      return example.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
});
