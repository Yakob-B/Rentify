const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    enum: ['hour', 'day', 'week', 'month'],
    default: 'day'
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String
  }],
  availability: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Text index for search on title and description
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
