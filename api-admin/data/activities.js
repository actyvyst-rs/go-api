const Activity = require('../models/Activity');
const mongoose = require('mongoose');

const getActivitiesByProvider = async providerId => {
  console.log('providerId');
  console.log(providerId);

  try {
    const activities = await Activity.find({ provider: providerId });
    return activities;
  } catch (err) {
    throw new Error(err);
  }
};

const activitiesCRUD = {
  getActivitiesByProvider
};

module.exports = activitiesCRUD;
