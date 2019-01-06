const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const nodeUtil = require('util');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { addRefreshToken } = require('../util/dbutil');
const { extractRequestParams } = require('../util/extract');

const {
  jwtSecret,
  jwtTokenExpiration,
  jwtRefreshTokenExpiration
} = require('./../config');

const pingHandler = (_, res) => {
  res.json({
    data: {
      type: 'Message',
      id: 0,
      attributes: {
        message: 'authAPI up and running'
      }
    }
  });
};

const promJwtVerify = nodeUtil.promisify(jwt.verify);
const promJwtSign = nodeUtil.promisify(jwt.sign);
const promBcryptCompare = nodeUtil.promisify(bcrypt.compare);

const loginHandler = (req, res) => {
  // State object to pass state through Promise chain
  let chainState = {};
  // Extract email & password from request
  extractRequestParams(req.body, {
    email: 'String',
    password: 'String'
  })
    .then(credentials => {
      // Find user in DB by email
      chainState.credentials = credentials;
      return User.findOne({ email: credentials.email });
    })
    .then(user => {
      // Check password
      if (!user) {
        throw new Error('user not found');
      } else {
        chainState.user = user;
        return promBcryptCompare(
          chainState.credentials.password,
          user.password
        );
      }
    })
    .then(isMatch => {
      if (!isMatch) {
        throw new Error('password invalid');
      } else {
        // Create access token
        const payload = {
          id: chainState.user._id,
          firstName: chainState.user.firstName,
          lastName: chainState.user.lastName,
          email: chainState.user.email
        };
        return promJwtSign(payload, jwtSecret, {
          expiresIn: jwtTokenExpiration
        });
      }
    })
    .then(token => {
      // Create refresh token
      chainState.token = token;
      const refreshPayload = { name: 'refreshToken' };
      chainState.refreshPayload = refreshPayload;
      return promJwtSign(refreshPayload, jwtSecret, {
        expiresIn: jwtRefreshTokenExpiration
      });
    })
    .then(refreshToken => {
      chainState.refreshToken = refreshToken;
      // Store id of refresh token in DB

      return addRefreshToken(chainState.user.id, refreshToken, 'test');
    })
    .then(() => {
      // Return access and refresh token
      return res.status(200).json({
        data: {
          type: 'JSON Web Token',
          id: chainState.user.id,
          attributes: {
            token: chainState.token,
            refreshToken: chainState.refreshToken
          }
        }
      });
    })
    .catch(err => {
      // Handle errors
      return res.status(500).json({
        errors: [
          {
            status: 500,
            code: 'serviceNotAvailable',
            ref_id: uuid(),
            title: 'Service not available.',
            details: err.message,
            source: { parameters: ['database'] }
          }
        ]
      });
    });
};

const accessTokenHandler = (req, res) => {
  let chainState = {};
  // extract token and refreshtoken from body
  extractRequestParams(req.body, { token: 'String', refreshToken: 'String' })
    .then(result => {
      // get user from access token (even if token already expired)
      chainState.refreshToken = result.refreshToken;
      chainState.token = result.token;
      return promJwtVerify(result.token, jwtSecret, {
        ignoreExpiration: true
      });
    })
    .then(decodedToken => {
      // verify refreshtoken
      chainState.userId = decodedToken.id;
      return promJwtVerify(chainState.refreshToken, jwtSecret);
    })
    .then(decodedToken => {
      //check db for matching record for refreshtoken, user and client
      return RefreshToken.findOne({
        refreshToken: chainState.refreshToken,
        user: chainState.userId,
        client: 'test'
      });
    })
    .then(refreshToken => {
      // if refreshToken not found in db, throw error
      if (!refreshToken) {
        throw new Error('refreshToken is null');
      }
      // Get user info from db
      return User.findOne({ _id: chainState.userId });
    })
    .then(user => {
      // create new accesstoken
      chainState.user = user;
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
      return promJwtSign(payload, jwtSecret, { expiresIn: jwtTokenExpiration });
    })
    .then(token => {
      chainState.newToken = token;
      //create new refreshToken
      const payload = { name: 'refreshToken' };
      return promJwtSign(payload, jwtSecret, {
        expiresIn: jwtRefreshTokenExpiration
      });
    })
    .then(refreshToken => {
      chainState.newRefreshToken = refreshToken;
      return addRefreshToken(
        chainState.user.id,
        chainState.newRefreshToken,
        'test'
      );
    })
    .then(() => {
      return res.status(200).json({
        data: {
          type: 'AccessToken',
          attributes: {
            token: chainState.newToken,
            refreshToken: chainState.newRefreshToken
          }
        }
      });
    })
    .catch(err => {
      return res.status(500).json({
        errors: [
          {
            status: 500,
            code: 'serviceNotAvailable',
            ref_id: uuid(),
            title: 'Service not available.',
            details: err.message,
            source: {}
          }
        ]
      });
    });
};

const registerHandler = (req, res) => {
  // Verify if request is valid
  console.log('AUTHAPI-REQUEST-BODY: ' + JSON.stringify(req.body));
  if (
    !req.body.email ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.password
  ) {
    const code = 'missingRequiredParameter';
    const title = 'Required request parameters are missing';
    const detail =
      'One or more required request parameters are missing. See source for details.';
    const source = { parameters: [] };
    if (!req.body.email) {
      source.parameters.push('email');
    }
    if (!req.body.password) {
      source.parameters.push('password');
    }
    if (!req.body.firstName) {
      source.parameters.push('firstName');
    }
    if (!req.body.lastName) {
      source.parameters.push('lastName');
    }
    return res.status(400).json({
      errors: [
        {
          status: 400,
          code: code,
          ref_id: uuid(),
          title: title,
          detail: detail,
          source: source
        }
      ]
    });
  }
  // Lookup user by email
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // User already exists, return error
      return res.status(400).json({
        errors: [
          {
            status: 400,
            code: 'userAlreadyExists',
            ref_id: uuid(),
            title: 'User already exists',
            details: 'A user with this email address is already registered',
            source: { parameters: ['email'] }
          }
        ]
      });
    } else {
      // Create user object from mongoose User model
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });
      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({
              errors: [
                {
                  status: 500,
                  code: 'unexpectedServerError',
                  ref_id: uuid(),
                  title: 'Unexpected Server Error',
                  detail: err.message,
                  source: {}
                }
              ]
            });
          }
          newUser.password = hash;
          // Save new user to database
          newUser
            .save()
            .then(user => {
              res.status(200).json({
                data: {
                  type: 'User',
                  id: user.id,
                  attributes: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    state: 'registered'
                  }
                }
              });
            })
            .catch(err => {
              return res.status(500).json({
                errors: [
                  {
                    status: 500,
                    code: 'serviceNotAvailable',
                    ref_id: uuid(),
                    title: 'Service not available',
                    details: err.message,
                    source: { parameters: ['database'] }
                  }
                ]
              });
            });
        });
      });
    }
  });
};

const currentHandler = (req, res) => {
  return res.json({
    data: {
      type: 'Placeholder',
      id: 0,
      attributes: { placeholder: 'Current User' }
    }
  });
};

router.get('/', pingHandler);
router.post('/login', loginHandler);
router.post('/accesstoken', accessTokenHandler);
router.post('/register', registerHandler);
router.get('/current', currentHandler);
module.exports = router;
