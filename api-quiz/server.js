const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { port, mongoURI } = require('./config');
const quizRoutes = require('./routes/quiz');

const server = express();

mongoose
  .connect(
    mongoURI,
    // 'mongodb://ds257372.mlab.com:57372/go-quiz',
    // 'mongodb://mongo:27017/go-quiz',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(err);
  });

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/', quizRoutes);

server.listen(port, () => {
  console.log(`Quiz-Service listening on port ${port}`);
});
