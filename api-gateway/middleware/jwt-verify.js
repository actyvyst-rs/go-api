const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./../config');
const uuid = require('uuid/v4');

//Middleware to verify token
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, jwtSecret, function(err, decoded) {
      if (err) {
        let details = 'Access to this resource is denied';
        if (err.name && err.name === 'TokenExpiredError') {
          details = 'access token expired';
        }
        return res.status(403).json({
          errors: [
            {
              status: 403,
              code: 'accessDenied',
              ref_id: uuid(),
              title: 'Access denied',
              details: details,
              source: {}
            }
          ]
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      errors: [
        {
          status: 403,
          code: 'accessDenied',
          ref_id: uuid(),
          title: 'Access denied',
          details: 'Access to this resource is denied',
          source: {}
        }
      ]
    });
  }
};

module.exports = verifyToken;
