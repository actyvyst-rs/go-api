const { ACTIVITIES_PORT, ACTIVITIES_MONGO_URI } = process.env;

module.exports = {
  port: ACTIVITIES_PORT,
  mongoURI: ACTIVITIES_MONGO_URI
};
