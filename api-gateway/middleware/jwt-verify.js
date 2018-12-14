const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./../config');
//Middleware to verify token
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token.substring(7), jwtSecret, function(err, decoded) {
      if (err) {
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
      } else {
        console.log(decoded);
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
