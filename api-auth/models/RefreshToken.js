const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const RefreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  }
});

module.exports = RefreshToken = mongoose.model(
  'refreshtokens',
  RefreshTokenSchema
);
