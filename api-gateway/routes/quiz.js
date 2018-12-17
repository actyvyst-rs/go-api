const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const axios = require('axios');
const { quizPort } = require('../config');
const httpClient = axios.create({
  baseURL: `http://api-quiz:${quizPort}/`,
  // baseURL: `http://${hostname}:${port}/`,
  timeout: 2000
});

router.get('/', (req, res) => {
  httpClient
    .get('/')
    .then(response => {
      return res.status(200).json(response.data);
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
              ref_id: uuid(),
              title: 'Service not available',
              details: error.message,
              source: {
                parameters: ['quizAPI']
              }
            }
          ]
        });
      }
    });
});

module.exports = router;
