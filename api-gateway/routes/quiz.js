const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const axios = require('axios');
const { quizPort } = require('../config');
const httpClient = axios.create({
  baseURL: `http://api-quiz:${quizPort}/`,
  timeout: 2000
});

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
