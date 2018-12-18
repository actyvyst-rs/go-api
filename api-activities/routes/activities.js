const express = require('express');
const router = express.Router();
const JSONAPISerializer = require('json-api-serializer');
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Category = require('../models/Category');

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

router.get('/', async (req, res) => {
  var categoryMatchPhrase = {};
  if (req.query.category) {
    console.log(`Category=${req.query.category}`);
    await Category.findOne({ name: req.query.category })
      .exec()
      .then(category => {
        if (category) {
          console.log('Category:');
          console.log(category);
          categoryMatchPhrase = {
            category: mongoose.Types.ObjectId(category.id)
          };
        } else {
          return res.send(activitySerializer.serialize('Activity', {}));
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send(activitySerializer.serializeError(err));
      });
  }
  console.log('categoryMatchPhrase:');
  console.log(categoryMatchPhrase);
  Activity.aggregate([
    { $match: categoryMatchPhrase },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $lookup: {
        from: 'providers',
        localField: 'provider',
        foreignField: '_id',
        as: 'provider'
      }
    },
    {
      $unwind: '$provider'
    }
  ])
    .then(activities => {
      res.send(activitySerializer.serialize('Activity', activities));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(activitySerializer.serializeError(err));
    });
});

module.exports = router;
