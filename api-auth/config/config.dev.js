const { QUIZ_PORT, QUIZ_MONGO_URI, JWT_SECRET } = process.env;

module.exports = {
  port: QUIZ_PORT,
  jwtSecret: JWT_SECRET,
  mongoURI: QUIZ_MONGO_URI
};
