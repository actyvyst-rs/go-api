const express = require('express');
const router = express.Router();
const axios = require('axios');
const JSONAPISerializer = require('json-api-serializer');
const { activitiesPort } = require('../config');

const httpClient = axios.create({
  baseURL: `http://api-activities:${activitiesPort}/`,
  timeout: 2000
});

const activitySerializer = new JSONAPISerializer();
activitySerializer.register('Activity');

router.get('/*', (req, res) => {
  httpClient
    .get(req.path, { params: req.query })
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      console.log(error.response.data);
      return res.status(error.response.status).json(error.response.data);
    });
});

module.exports = router;
