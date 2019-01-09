const jwt = require('jsonwebtoken');
const JSONAPISerializer = require('json-api-serializer');
const { jwtSecret } = require('./../config');
const uuid = require('uuid/v4');

const Serializer = new JSONAPISerializer();

//Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, jwtSecret, function(err, decoded) {
      if (err) {
        return res.status(403).json({
          errors: [
            {
              status: 403,
              code: 'ACCESS_DENIED',
              details: 'Access denied'
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
    return res.status(400).json({
      errors: [
        {
          status: 400,
          code: 'BAD_REQUEST',
          details:
            'Protected resource: Provide parameter [x-access-token] in request header.'
        }
      ]
    });
  }
};

module.exports = verifyToken;
