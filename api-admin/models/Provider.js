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

ProviderSchema.statics.getById = async id => {
  try {
    const provider = Provider.findById(id);
    return provider;
  } catch (err) {
    throw new Error(err);
  }
};

ProviderSchema.statics.updateById = async (id, update) => {
  try {
    const newProvider = await Provider.findByIdAndUpdate(id, update, {
      new: true
    });
    return newProvider;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = Provider = mongoose.model('provider', ProviderSchema);
