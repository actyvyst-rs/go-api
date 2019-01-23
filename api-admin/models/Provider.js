const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const ProviderSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: false
  },

  contact: {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  location: {
    country: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  infos: [
    {
      description: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = Provider = mongoose.model('provider', ProviderSchema);
