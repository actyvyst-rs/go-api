const { GATEWAY_PORT, JWT_SECRET } = process.env;

module.exports = {
  port: GATEWAY_PORT,
  jwtSecret: JWT_SECRET
};
