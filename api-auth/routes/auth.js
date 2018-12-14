const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const User = require('../models/User');
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
  // Verify if request is valid
  if (!req.body.email || !req.body.password) {
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
  const email = req.body.email;
  const password = req.body.password;
  // Lookup user by email
  User.findOne({ email })
    .then(user => {
      // If user not found, return 404
      if (!user) {
        return res.status(404).json({
          errors: [
            {
              status: 400,
              code: 'wrongCredentials',
              ref_id: uuid(),
              title: 'Wrong credentials',
              detail:
                "Username and password do not match or you don't have an account yet",
              source: { parameters: ['email'] }
            }
          ]
        });
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          };

          // Sign token
          jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
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
            res.status(200).json({
              data: {
                type: 'JSON Web Token',
                id: user.id,
                attributes: {
                  token: 'Bearer ' + token
                }
              }
            });
          });
          //Wrong password
        } else {
          res.status(400).json({
            errors: [
              {
                status: 400,
                code: 'wrongCredentials',
                ref_id: uuid(),
                title: 'Wrong credentials',
                detail:
                  "Username and password do not match or you don't have an account yet",
                source: { parameters: ['username', 'password'] }
              }
            ]
          });
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
