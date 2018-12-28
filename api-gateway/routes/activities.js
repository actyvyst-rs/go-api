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

router.get('/', (req, res) => {
  httpClient
    .get('/', { params: req.query })
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      console.log(error.response.data);
      return res.status(error.response.status).json(error.response.data);
    });
});

router.get('/health', (req, res) => {
  httpClient
    .get('/health')
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(activitySerializer.serializeError(err));
    });
});

router.get('/:id', (req, res) => {
  httpClient
    .get(`/${req.params.id}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(activitySerializer.serializeError(err));
    });
});

module.exports = router;
