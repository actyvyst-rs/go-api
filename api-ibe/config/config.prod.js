const { IBE_PORT, IBE_MONGO_URI } = process.env;

module.exports = {
  port: IBE_PORT,
  mongoURI: IBE_MONGO_URI
};
