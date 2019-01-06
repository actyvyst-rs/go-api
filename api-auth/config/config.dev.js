const { AUTH_PORT, AUTH_MONGO_URI, JWT_SECRET } = process.env;

module.exports = {
  port: AUTH_PORT,
  jwtSecret: JWT_SECRET,
  jwtTokenExpiration: 120, // 2 min
  jwtRefreshTokenExpiration: 31536000, //1 year
  mongoURI: AUTH_MONGO_URI
};
