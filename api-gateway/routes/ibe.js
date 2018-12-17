const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ibePort } = require('../config');

const httpClient = axios.create({
  baseURL: `http://api-ibe:${ibePort}/`,
  // baseURL: `http://${hostname}:${port}/`,
  timeout: 2000
});

router.get('/', (req, res) => {
  httpClient
    .get('/')
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      console.log(error.response.data);
      return res.status(error.response.status).json(error.response.data);
    });
});

router.get('/offers', (_, res) => {
  httpClient
    .get('/offers')
    .then(response => {
      res.json(response.data.result);
    })
    .catch(err => {
      console.log(err);
      res.json({
        error: {
          code: err.code,
          source: 'holidoo IBE API',
          title: err.code,
          details: ''
        }
      });
    });
});

module.exports = router;
