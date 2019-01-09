const express = require('express');
const router = express.Router();
const axios = require('axios');
const uuid = require('uuid/v4');
const verifyToken = require('./../middleware/jwt-verify');
const { authPort } = require('../config');

const httpClient = axios.create({
  baseURL: `http://api-auth:${authPort}/`,
  timeout: 2000
});

// protected routes

router.get('/profile', verifyToken, (req, res) => {
  httpClient
    .get(req.path, { params: req.decoded })
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        if (error.request) {
          console.log(error.request);
        } else {
          console.log(error.message);
        }
        return res.status(500).json({
          errors: [{ httpStatus: 500, title: 'Internal server Error' }]
        });
      }
    });
});

// Proxy for all GET routes except the ones above

router.get('/*', (req, res) => {
  httpClient
    .get(req.path, { params: req.query })
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        if (error.request) {
          console.log(error.request);
        } else {
          console.log(error.message);
        }
        return res.status(500).json({
          errors: [{ httpStatus: 500, title: 'Internal server Error' }]
        });
      }
    });
});

// Proxy for all POST routes except the ones above

router.post('/*', (req, res) => {
  httpClient
    .post(req.path, req.body, { params: req.query })
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        if (error.request) {
          console.log(error.request);
        } else {
          console.log(error.message);
        }
        return res.status(500).json({
          errors: [{ httpStatus: 500, title: 'Internal server Error' }]
        });
      }
    });
});

module.exports = router;
