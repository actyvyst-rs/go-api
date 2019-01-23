const { ADMIN_PORT, ADMIN_MONGO_URI } = process.env;

module.exports = {
  port: ADMIN_PORT ? ADMIN_PORT : 4000,
  mongoURI: ADMIN_MONGO_URI
    ? ADMIN_MONGO_URI
    : 'mongodb://localhost:27017/go-admin'
};
