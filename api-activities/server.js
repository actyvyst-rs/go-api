const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { port, mongoURI } = require('./config');
const activityRoutes = require('./routes/activities');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.on('error', (err) => {
  console.log(err);
})
db.once('open', () => {
  console.log('Connected to database');
})



app.use('/', activityRoutes);

const server = app.listen(port, () => {
  console.log(`actyvyst Go Activities API listening on port ${port}`);
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
