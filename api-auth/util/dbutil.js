const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const addRefreshToken = (userId, refreshToken, client) => {
  const rt = {
    refreshToken: refreshToken,
    client: client,
    user: userId
  };

  return RefreshToken.findOneAndUpdate({ user: userId, client: client }, rt, {
    upsert: true,
    new: true,
    runValidators: true
  });
};

module.exports.addRefreshToken = addRefreshToken;
