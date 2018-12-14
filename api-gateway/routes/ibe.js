const express = require('express');
const router = express.Router();
const axios = require('axios');

const {
  hostname,
  serviceIBE: { port }
} = require('./../config');
const httpClient = axios.create({
  baseURL: 'http://api-ibe/',
  // baseURL: `http://${hostname}:${port}/`,
  timeout: 2000
});

router.get('/offers', async (_, res) => {
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
