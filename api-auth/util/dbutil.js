const User = require('../models/User');

const addRefreshToken = (userId, refreshTokenId, clientId) => {
  return new Promise((resolve, reject) => {
    const condition = { _id: userId, 'refreshTokens.clientId': clientId };
    const update = { $set: { 'refreshTokens.$.tokenId': refreshTokenId } };

    User.updateOne(condition, update, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.nModified > 0) {
          resolve();
        } else {
          User.updateOne(
            { _id: userId },
            {
              $push: {
                refreshTokens: { clientId: clientId, tokenId: refreshTokenId }
              }
            },
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                if (result.nModified > 0) {
                  resolve();
                } else {
                  reject(new Error('Refresh token storage failed'));
                }
              }
            }
          );
        }
      }
    });
  });
};

module.exports.addRefreshToken = addRefreshToken;
