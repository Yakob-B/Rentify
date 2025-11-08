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
  // GeoJSON location for geospatial queries (optional - only set if coordinates are valid)
  geo: {
    type: mongoose.Schema.Types.Mixed, // Use Mixed to allow flexible handling
    default: undefined
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

// Pre-validate hook to clean up invalid geo fields BEFORE validation
listingSchema.pre('validate', function(next) {
  // Clean up invalid geo fields before validation
  if (this.geo !== undefined && this.geo !== null) {
    // Check if geo.type is null (this causes validation errors)
    if (this.geo && (this.geo.type === null || this.geo.type === undefined)) {
      // If type is null/undefined but coordinates exist, try to fix it
      if (Array.isArray(this.geo.coordinates) && this.geo.coordinates.length === 2) {
        this.geo.type = 'Point';
      } else {
        // Invalid geo, remove it
        this.geo = undefined;
      }
    }
    
    // Check if geo is an object with invalid structure
    if (typeof this.geo === 'object' && this.geo !== null) {
      // If coordinates are missing or invalid, try to populate from location
      if (!Array.isArray(this.geo.coordinates) || this.geo.coordinates.length !== 2) {
        if (this.location && this.location.coordinates) {
          const { lat, lng } = this.location.coordinates;
          if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            this.geo = {
              type: 'Point',
              coordinates: [Number(lng), Number(lat)],
              address: this.location.address || (this.geo.address ? this.geo.address : undefined)
            };
          } else {
            this.geo = undefined;
          }
        } else {
          this.geo = undefined;
        }
      }
    }
  }
  
  next();
});

// Custom validation for geo field
listingSchema.path('geo').validate(function(value) {
  // If geo is undefined, null, or not set, it's valid (field is optional)
  if (value === undefined || value === null) {
    return true;
  }
  
  // If geo exists, it must have valid structure
  if (typeof value !== 'object') {
    return false;
  }
  
  // Check if coordinates are valid
  if (!Array.isArray(value.coordinates) || value.coordinates.length !== 2) {
    return false;
  }
  
  const [lng, lat] = value.coordinates;
  if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
    return false;
  }
  
  // Check type if provided (should not be null)
  if (value.type !== undefined && value.type !== null && value.type !== 'Point') {
    return false;
  }
  
  return true;
}, 'Geo must be a valid GeoJSON Point with coordinates [lng, lat] or undefined/null');

// Pre-save hook to populate geo.coordinates from location.coordinates
listingSchema.pre('save', function(next) {
  // Check if geo is valid
  const hasValidGeo = this.geo && 
    typeof this.geo === 'object' &&
    Array.isArray(this.geo.coordinates) && 
    this.geo.coordinates.length === 2 &&
    typeof this.geo.coordinates[0] === 'number' &&
    typeof this.geo.coordinates[1] === 'number' &&
    !isNaN(this.geo.coordinates[0]) &&
    !isNaN(this.geo.coordinates[1]);

  if (hasValidGeo) {
    // Geo is valid, ensure type is set
    if (!this.geo.type) {
      this.geo.type = 'Point';
    }
    return next();
  }

  // Geo is invalid or missing, try to populate from location.coordinates
  if (this.location && this.location.coordinates) {
    const { lat, lng } = this.location.coordinates;
    if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
      // GeoJSON format: [longitude, latitude]
      this.geo = {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)],
        address: this.location.address || (this.geo && this.geo.address ? this.geo.address : undefined)
      };
      return next();
    }
  }

  // If we get here, geo is invalid and cannot be populated
  // Set to undefined to remove it (MongoDB will unset the field)
  this.geo = undefined;
  
  next();
});

// Text index for search on title and description
listingSchema.index({ title: 'text', description: 'text' });
// 2dsphere index for geospatial queries (sparse index - only indexes documents with geo field)
listingSchema.index({ geo: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Listing', listingSchema);
