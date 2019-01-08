const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { port } = require('./config');
const gatewayRoutes = require('./routes/gateway');
const quizRoutes = require('./routes/quiz');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

console.log(`port: ${port}`);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', gatewayRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

const server = app.listen(port, () => {
  console.log(`actyvyst GO Gateway API listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
});
