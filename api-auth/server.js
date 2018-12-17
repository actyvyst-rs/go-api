const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { port, mongoURI } = require('./config');
const authRoutes = require('./routes/auth');

const server = express();

mongoose
  .connect(
    mongoURI,
    // 'mongodb://mongo:27017/go-auth',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(err);
  });

// mongoose
//   .connect(
//     'mongodb://mongo/go-auth',
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch(err => {
//     console.log(err);
//   });

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/', authRoutes);

server.listen(port, () => {
  console.log(`holidoo Auth API listening on port ${port}`);
});
