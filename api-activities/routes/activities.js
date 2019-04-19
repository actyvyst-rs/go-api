const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('json-api-serializer');
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Category = require('../models/Category');
const activityDBHelper = require('../data/activity');
const availabilityController = require('../controllers/availabilities');
const activityController = require('../controllers/activities');

const activitySerializer = new JSONAPISerializer();
activitySerializer.register('Activity', {
  id: '_id'
});

router.get('/health', (req, res) => {
  res.json({
    data: {
      type: 'Ping',
      id: 0,
      attributes: {
        message: 'Up and running',
        service: 'GO destination API IBE V2'
      }
    }
  });
});

router.get('/test', async (req, res) => {
  try {
    activities = await Activity.find().exec();
    return res.json(activities);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
})

router.get('/:id', (req, res) => {
  const matchPhrase = {
    _id: mongoose.Types.ObjectId(req.params.id)
  };
  activityDBHelper
    .aggregateActivities(matchPhrase)
    .then(activity => {
      return res.send(activitySerializer.serialize('Activity', activity));
    })
    .catch(err => {
      res.status(400).send(activitySerializer.serializeError(err));
      console.log(err);
    });
});

router.get('/', async (req, res) => {
  try {
    var matchPhrase = {};

    if (req.query.category) {
      let category = await Category.findOne({
        name: req.query.category
      }).exec();
      if (category) {
        matchPhrase.category = mongoose.Types.ObjectId(category.id);
      } else {
        return res.send(activitySerializer.serialize('Activity', {}));
      }
    }

    if (req.query.q) {
      matchPhrase.$text = {
        $search: req.query.q
      };
    }
    console.log('matchPhrase:');
    console.log(matchPhrase);
    console.log('req.query.q:');
    console.log(req.query.q);
    activities = await activityDBHelper.aggregateActivities(matchPhrase);

    return res.send(activitySerializer.serialize('Activity', activities));
  }
  catch (err) {
    console.log(err);
    return res.status(500).send(activitySerializer.serializeError(err));
  }
});



router.get('/:id/availabilities', availabilityController.getAvailabilities);
router.post('/', activityController.createActivity);
router.patch('/:id', activityController.updateActivity);


module.exports = router;