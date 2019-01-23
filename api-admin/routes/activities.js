const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIError = require('jsonapi-serializer').Error;
const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const crud = require('../data/activities');

const activitySerializer = new JSONAPISerializer('Activity', {
  id: '_id',
  attributes: ['name', 'teaser', 'description', 'images', 'infos', 'location']
});

router.get('/', async (req, res) => {
  try {
    console.log('activityroute');
    console.log(req.query.providerId);
    const activities = await crud.getActivitiesByProvider(req.query.providerId);
    return res.send(activitySerializer.serialize(activities));
  } catch (err) {
    res.status(400).send(new JSONAPIError({ code: '123', title: err }));
    console.log(err);
  }
});

module.exports = router;
