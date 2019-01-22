const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uuid = require('uuid/v4');
const JSONAPISerializer = require('json-api-serializer');

const nodeUtil = require('util');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { APIError } = require('../util/err');
const { addRefreshToken } = require('../util/dbutil');
const { extractRequestParams } = require('../util/extract');

const {
  jwtSecret,
  jwtTokenExpiration,
  jwtRefreshTokenExpiration
} = require('./../config');

const Serializer = new JSONAPISerializer();
Serializer.register('JWT');
Serializer.register('User');
Serializer.register('AuthService');

const pingHandler = (_, res) => {
  data = { message: 'authAPI up and running' };
  res.json(Serializer.serialize('AuthService', data));
};

const jwtVerify = nodeUtil.promisify(jwt.verify);
const jwtSign = nodeUtil.promisify(jwt.sign);

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
        throw new APIError(400, 'AUTH_WRONG_CREDENTIALS', 'Wrong credentials');
      } else {
        chainState.user = user;
        if (
          bcrypt.compareSync(chainState.credentials.password, user.password)
        ) {
          // Create access token
          const payload = {
            id: chainState.user._id,
            firstName: chainState.user.firstName,
            lastName: chainState.user.lastName,
            email: chainState.user.email,
            isProvider: chainState.user.acl & 1
          };

          return jwtSign(payload, jwtSecret, {
            expiresIn: jwtTokenExpiration
          });
        } else {
          throw new APIError(
            400,
            'AUTH_WRONG_CREDENTIALS',
            'Wrong credentials'
          );
        }
      }
    })
    .then(token => {
      // Create refresh token
      chainState.token = token;
      const refreshPayload = { name: 'refreshToken' };
      chainState.refreshPayload = refreshPayload;
      return jwtSign(refreshPayload, jwtSecret, {
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
      const data = {
        id: chainState.user.id,
        token: chainState.token,
        refreshToken: chainState.refreshToken
      };
      return res.status(200).json(Serializer.serialize('JWT', data));
    })
    .catch(err => {
      // Handle errors
      const status = err instanceof APIError ? err.status : 500;
      return res.status(status).json(Serializer.serializeError(err));
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
      return jwtVerify(result.token, jwtSecret, {
        ignoreExpiration: true
      });
    })
    .then(decodedToken => {
      // verify refreshtoken
      chainState.userId = decodedToken.id;
      return jwtVerify(chainState.refreshToken, jwtSecret);
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
        throw new APIError(400, 'AUTH_INVALID_TOKEN', 'Invalid refreshToken');
      }
      // Get user info from db
      return User.findOne({ _id: chainState.userId });
    })
    .then(user => {
      if (!user) {
        throw new APIError(400, 'AUTH_INVALID_TOKEN', 'Invalid refreshToken');
      }
      // create new accesstoken
      chainState.user = user;
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      };
      return jwtSign(payload, jwtSecret, { expiresIn: jwtTokenExpiration });
    })
    .then(token => {
      chainState.newToken = token;
      //create new refreshToken
      const payload = { name: 'refreshToken' };
      return jwtSign(payload, jwtSecret, {
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
      const data = {
        token: chainState.newToken,
        refreshToken: chainState.newRefreshToken
      };
      return res.status(200).json(Serializer.serialize('JWT', data));
    })
    .catch(err => {
      const status = err instanceof APIError ? err.status : 500;
      return res.status(status).json(Serializer.serializeError(err));
    });
};

const registerHandler = (req, res) => {
  let chainState = {};
  // Verify if request is valid
  extractRequestParams(req.body, {
    email: 'String',
    firstName: 'String',
    lastName: 'String',
    password: 'String'
  })
    .then(params => {
      chainState.params = params;
      // Check if user already exists
      return User.findOne({ email: chainState.params.email });
    })
    .then(user => {
      // Save user
      if (user) {
        throw new APIError(
          400,
          'AUTH_USER_ALREADY_EXISTS',
          'User already exists'
        );
      } else {
        const newUser = new User({
          firstName: chainState.params.firstName,
          lastName: chainState.params.lastName,
          email: chainState.params.email,
          password: chainState.params.password
        });
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(chainState.params.password, salt);
        return newUser.save();
      }
    })
    // Return user
    .then(user => {
      const { id, firstName, lastName } = user;
      const data = { id, firstName, lastName };
      return res.status(200).json(Serializer.serialize('User', data));
    })
    .catch(err => {
      const status = err instanceof APIError ? err.status : 500;
      return res.status(status).json(Serializer.serializeError(err));
    });
};

const profileHandler = (req, res) => {
  // Extract user id from query
  extractRequestParams(req.query, {
    id: 'String'
  })
    // Find user
    .then(params => {
      return User.findById(mongoose.Types.ObjectId(params.id));
    })
    //  Return user
    .then(user => {
      if (!user) {
        throw new APIError(400, 'AUTH_USER_NOT_FOUND', 'Could not find user.');
      }
      const { id, lastName, firstName, email } = user;
      const data = { id, lastName, firstName, email };
      return res.status(200).json(Serializer.serialize('User', data));
    })
    .catch(err => {
      const status = err instanceof APIError ? err.status : 500;
      return res.status(status).json(Serializer.serializeError(err));
    });
};

router.get('/', pingHandler);
router.post('/login', loginHandler);
router.post('/accesstoken', accessTokenHandler);
router.post('/register', registerHandler);
router.get('/profile', profileHandler);
module.exports = router;
