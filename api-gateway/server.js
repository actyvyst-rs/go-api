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

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

server.use('/api', gatewayRoutes);
server.use('/api/quiz', quizRoutes);
server.use('/api/activities', activityRoutes);
server.use('/api/user', userRoutes);
server.use('/api/auth', authRoutes);

server.listen(port, () => {
  console.log(`actyvyst GO Gateway API listening on port ${port}`);
});
