const express = require('express');
const router = express.Router();
const axios = require('axios');
const uuid = require('uuid/v4');
const verifyToken = require('./../middleware/jwt-verify');
const { authPort } = require('../config');

const httpClient = axios.create({
  baseURL: `http://api-auth:${authPort}/`,
  // baseURL: `http://${hostname}:${port}/`,
  timeout: 2000
});

router.get('/', (_, res) => {
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

router.post('/register', (req, res) => {
  httpClient
    .post('/register', req.body)
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({
          errors: [
            {
              status: 500,
              code: 'serviceNotAvailable',
              title: 'Service not available',
              details: err.message,
              source: {
                parameters: ['authAPI']
              }
            }
          ]
        });
      }
    });
});

router.post('/login', (req, res) => {
  httpClient
    .post('/login', req.body)
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({
          errors: [
            {
              status: 500,
              code: 'serviceNotAvailable',
              title: 'Service not available',
              details: error.message,
              source: {
                parameters: ['authAPI']
              }
            }
          ]
        });
      }
    });
});

router.post('/accesstoken', (req, res) => {
  httpClient
    .post('/accesstoken', req.body)
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else {
        return res.status(500).json({
          errors: [
            {
              status: 500,
              code: 'serviceNotAvailable',
              title: 'Service not available',
              details: error.message,
              source: {
                parameters: ['authAPI']
              }
            }
          ]
        });
      }
    });
});

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

module.exports = router;
