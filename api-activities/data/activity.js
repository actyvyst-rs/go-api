const Activity = require('../models/Activity');

const aggregateActivities = matchPhrase => {
  return new Promise((resolve, reject) => {
    Activity.aggregate([
      { $match: matchPhrase },
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
        resolve(activities);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports.aggregateActivities = aggregateActivities;
