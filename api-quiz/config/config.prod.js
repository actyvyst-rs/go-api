const { QUIZ_PORT, QUIZ_MONGO_URI } = process.env;

module.exports = {
  port: QUIZ_PORT,
  mongoURI: QUIZ_MONGO_URI,
  defaultSampleSize: 5
};
