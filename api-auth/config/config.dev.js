const { AUTH_PORT, AUTH_MONGO_URI, JWT_SECRET } = process.env;

module.exports = {
  port: AUTH_PORT,
  jwtSecret: JWT_SECRET,
  mongoURI: AUTH_MONGO_URI
};
