const { QUIZ_PORT, QUIZ_MONGO_URI, JWT_SECRET } = process.env;

module.exports = {
  port: QUIZ_PORT,
  jwtSecret: JWT_SECRET,
  jwtTokenExpiration: 900, // 15 min
  jwtRefreshTokenExpiration: 31536000, //1 year
  mongoURI: QUIZ_MONGO_URI
};
