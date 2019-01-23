const Provider = require('../models/Provider');
const mongoose = require('mongoose');

const getProvider = id => {
  return new Promise((resolve, reject) => {
    Provider.findById(id)
      .then(provider => {
        console.log(JSON.stringify(provider));
        resolve(provider);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const providerCRUD = {
  getProvider
};

module.exports = providerCRUD;
