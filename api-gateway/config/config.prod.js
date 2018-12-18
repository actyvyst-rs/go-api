const {
  GATEWAY_PORT,
  AUTH_PORT,
  ACTIVITIES_PORT,
  QUIZ_PORT,
  JWT_SECRET
} = process.env;

module.exports = {
  port: GATEWAY_PORT,
  authPort: AUTH_PORT,
  activitiesPort: ACTIVITIES_PORT,
  quizPort: QUIZ_PORT,
  jwtSecret: JWT_SECRET
};
