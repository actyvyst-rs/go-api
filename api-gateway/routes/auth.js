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
  res.status(200).json({
    data: {
      type: 'User',
      id: req.decoded.id,
      attributes: {
        firstName: req.decoded.firstName,
        lastName: req.decoded.lastName,
        email: req.decoded.email
      }
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
      console.log(error.response.data);
      return res.status(error.response.status).json(error.response.data);
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
      console.log(error.response.data);
      return res.status(error.response.status).json(error.response.data);
    });
});

module.exports = router;
