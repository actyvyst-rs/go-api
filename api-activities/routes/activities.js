const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('json-api-serializer');
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Category = require('../models/Category');
const activityDBHelper = require('../data/activity');

const activitySerializer = new JSONAPISerializer();
activitySerializer.register('Activity', { id: '_id' });

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

router.get('/:id', (req, res) => {
  const matchPhrase = { _id: mongoose.Types.ObjectId(req.params.id) };
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
  var matchPhrase = {};

  if (req.query.category) {
    await Category.findOne({ name: req.query.category })
      .exec()
      .then(category => {
        if (category) {
          // matchPhrase = {
          //   category: mongoose.Types.ObjectId(category.id)
          // };
          matchPhrase.category = mongoose.Types.ObjectId(category.id);
        } else {
          return res.send(activitySerializer.serialize('Activity', {}));
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send(activitySerializer.serializeError(err));
      });
  }

  if (req.query.q) {
    // matchPhrase = { $text: { $search: req.query.q } };
    matchPhrase.$text = { $search: req.query.q };
  }
  console.log('matchPhrase:');
  console.log(matchPhrase);
  console.log('req.query.q:');
  console.log(req.query.q);
  activityDBHelper
    .aggregateActivities(matchPhrase)
    .then(activities => {
      res.send(activitySerializer.serialize('Activity', activities));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(activitySerializer.serializeError(err));
    });
});

module.exports = router;
