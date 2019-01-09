const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { port, mongoURI } = require('./config');
const authRoutes = require('./routes/auth');

const app = express();

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    mongoose.set('useFindAndModify', false);
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', authRoutes);

const server = app.listen(port, () => {
  console.log(`actyvyst Go Auth API listening on port ${port}`);
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
