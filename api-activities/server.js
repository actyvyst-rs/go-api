const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { port, mongoURI } = require('./config');
const activityRoutes = require('./routes/activities');

const server = express();

mongoose
  .connect(
    mongoURI,
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

server.use('/', activityRoutes);

server.listen(port, () => {
  console.log(`actyvyst Go Activities API listening on port ${port}`);
});
