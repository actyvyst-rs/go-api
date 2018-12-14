const express = require('express');
const bodyParser = require('body-parser');
const { port } = require('./config');
const gatewayRoutes = require('./routes/gateway');
const quizRoutes = require('./routes/quiz');
const ibeRoutes = require('./routes/ibe');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

console.log(`port: ${port}`);

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/api', gatewayRoutes);
server.use('/api/quiz', quizRoutes);
server.use('/api/ibe', ibeRoutes);
server.use('/api/user', userRoutes);
server.use('/api/auth', authRoutes);

server.listen(port, () => {
  console.log(`holidoo API gateway listening on port ${port}`);
});
