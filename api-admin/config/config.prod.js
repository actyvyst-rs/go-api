const { ADMIN_PORT, ADMIN_MONGO_URI } = process.env;

module.exports = {
  port: ADMIN_PORT,
  mongoURI: ADMIN_MONGO_URI
};
