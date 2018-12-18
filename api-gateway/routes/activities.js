const express = require('express');
const router = express.Router();
const axios = require('axios');
const { activitiesPort } = require('../config');

const httpClient = axios.create({
  baseURL: `http://api-activities:${activitiesPort}/`,
  timeout: 2000
});

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
      res.json({
        error: {
          code: err.code,
          source: 'actyvyst Go Activities API',
          title: err.code,
          details: ''
        }
      });
    });
});

router.get('/', (req, res) => {
  httpClient
    .get('/')
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      console.log(err);
      res.json({
        error: {
          code: err.code,
          source: 'actyvyst Go Activities API',
          title: err.code,
          details: ''
        }
      });
    });
});

module.exports = router;
