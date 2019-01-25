const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { port, mongoURI } = require('./config');
const providerRoutes = require('./routes/providers');
const activityRoutes = require('./routes/activities');
const pingRoutes = require('./routes/ping');

const app = express();
app.use(cors());
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
  console.log('actyvyst Go Admin API connected to database');
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', pingRoutes);
app.use('/providers', providerRoutes);
app.use('/activities', activityRoutes);

const server = app.listen(port, () => {
  console.log(`actyvyst Go Admin API listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  });
});
