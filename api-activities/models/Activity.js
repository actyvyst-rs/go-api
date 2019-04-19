const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true
  },
  provider: {
    type: Schema.Types.ObjectId,
    required: true
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      }
    }
  ],
  teaser: {
    type: String,
    required: false
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
      required: false
    },
    lng: {
      type: Number,
      required: false
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

module.exports = Activity = mongoose.model('activities', ActivitySchema);
