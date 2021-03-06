const asyncMiddleware = require('../middleware/async');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Genre, validate } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get(
  '/',
  asyncMiddleware(async (req, res, next) => {
    const genre = await Genre.find().sort('genre');
    res.send(genre);
  })
);

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
      name: req.body.name,
    });

    await genre.save();
    res.send(genre);
  })
);

router.put(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );

    if (!genre)
      res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
  })
);

router.delete(
  '/:id',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
  })
);

router.get(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
  })
);

module.exports = router;
