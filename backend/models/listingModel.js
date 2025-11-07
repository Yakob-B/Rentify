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
  // GeoJSON location for geospatial queries
  geo: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length === 2;
        },
        message: 'coordinates must be an array of [lng, lat]'
      }
    },
    address: {
      type: String
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

// Pre-save hook to populate geo.coordinates from location.coordinates
listingSchema.pre('save', function(next) {
  // If geo.coordinates is missing or invalid, try to populate from location.coordinates
  if (!this.geo || !Array.isArray(this.geo.coordinates) || this.geo.coordinates.length !== 2) {
    if (this.location && this.location.coordinates) {
      const { lat, lng } = this.location.coordinates;
      if (typeof lat === 'number' && typeof lng === 'number') {
        // GeoJSON format: [longitude, latitude]
        this.geo = {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
          address: this.location.address || this.geo?.address
        };
      } else {
        // If geo exists but is incomplete (has type but no coordinates), remove it
        // This prevents "Can't extract geo keys" errors
        if (this.geo && this.geo.type && !this.geo.coordinates) {
          this.geo = null;
        }
      }
    } else {
      // If no location coordinates and geo is incomplete, remove geo field
      if (this.geo && this.geo.type && (!this.geo.coordinates || !Array.isArray(this.geo.coordinates) || this.geo.coordinates.length !== 2)) {
        this.geo = null;
      }
    }
  }
  
  // Ensure geo.type is set if geo exists
  if (this.geo && this.geo.coordinates && !this.geo.type) {
    this.geo.type = 'Point';
  }
  
  next();
});

// Text index for search on title and description
listingSchema.index({ title: 'text', description: 'text' });
// 2dsphere index for geospatial queries
listingSchema.index({ geo: '2dsphere' });

module.exports = mongoose.model('Listing', listingSchema);
