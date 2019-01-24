const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const JSONAPIError = require('jsonapi-serializer').Error;
const Activity = require('../models/Activity');

const activitySerializer = new JSONAPISerializer('Activity', {
  id: '_id',
  attributes: ['name', 'teaser', 'description', 'images', 'infos', 'location']
});

router.get('/', async (req, res) => {
  try {
    const activities = await Activity.getByProvider(req.query.providerId);
    return res.send(activitySerializer.serialize(activities));
  } catch (err) {
    res.status(400).send(
      new JSONAPIError({
        code: 'ADMIN_GET_ACTIVITIES',
        title: err,
        detail: err
      })
    );
    console.log(err);
  }
});

module.exports = router;
