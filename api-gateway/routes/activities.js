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

router.post('/', async (req, res, next) => {
  try {
    console.log('activities post route hit');
    response = await httpClient
      .post(req.path, req.body, { params: req.query });
    return res.json({ msg: 'done' });
  } catch (err) {
    console.log(err);
    return res.status(error.response.status).json(error.response.data);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    console.log('activities patch route hit');
    response = await httpClient
      .patch(req.path, req.body, { params: req.query });
    console.log(response.ok);
    return res.json({ msg: 'done' });
  } catch (err) {
    console.log(err);
    return res.status(error.response.status).json(error.response.data);
  }
});

module.exports = router;
