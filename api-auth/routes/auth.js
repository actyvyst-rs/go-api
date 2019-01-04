const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const User = require('../models/User');
const { addRefreshToken } = require('../util/dbutil');
const { extractRequestParams } = require('../util/extract');
const { ParamError } = require('../util/err');

const { jwtSecret } = require('./../config');

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

const loginHandler = (req, res) => {
  // State object to pass state through Promise chain
  let chainState = {};
  // Check if email & password are part of request
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
      if (!user) {
        return Promise.reject(new Error('User not found'));
      } else {
        chainState.user = user;
        // Check password
        return bcrypt.compare(chainState.credentials.password, user.password);
      }
    })
    .then(isMatch => {
      if (!isMatch) {
        return Promise.reject(new Error('Wrong Password'));
      } else {
        const payload = {
          id: chainState.user._id,
          firstName: chainState.user.firstName,
          lastName: chainState.user.lastName,
          email: chainState.user.email
        };
        // Create access token
        jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
          if (err) {
            return Promise.reject(new Error('JWT signing failed'));
          } else {
            chainState.token = token;
            return Promise.resolve(token);
          }
        });
      }
    })
    .then(token => {
      const refreshPayload = { id: uuid(), client: 'test' };
      chainState.refreshPayload = refreshPayload;
      // Create refresh token
      jwt.sign(
        refreshPayload,
        jwtSecret,
        { expiresIn: 2500000 },
        (err, refreshToken) => {
          if (err) {
            return Promise.reject(new Error('JWT signing failed'));
          } else {
            chainState.refreshToken = refreshToken;
            return Promise.resolve(refreshToken);
          }
        }
      );
    })
    .then(refreshToken => {
      // Store id of refresh token in DB
      return addRefreshToken(
        chainState.user._id,
        chainState.refreshPayload.id,
        chainState.refreshPayload.client
      );
    })
    .then(refreshToken => {
      // Return access and refresh token
      return res.status(200).json({
        data: {
          type: 'JSON Web Token',
          id: chainState.user._id,
          attributes: {
            token: chainState.token,
            refreshToken: chainState.refreshToken
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
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
router.post('/register', registerHandler);
router.get('/current', currentHandler);
module.exports = router;
