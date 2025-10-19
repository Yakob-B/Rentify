const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'telebirr'],
    default: 'telebirr'
  },
  paymentDetails: {
    transactionId: {
      type: String,
      default: ''
    },
    paymentProvider: {
      type: String,
      enum: ['stripe', 'telebirr'],
      default: 'telebirr'
    },
    providerTransactionId: {
      type: String,
      default: ''
    },
    paymentUrl: {
      type: String,
      default: ''
    },
    qrCode: {
      type: String,
      default: ''
    },
    paidAt: {
      type: Date
    },
    refundedAt: {
      type: Date
    },
    refundReason: {
      type: String,
      default: ''
    }
  },
  message: {
    type: String,
    default: ''
  },
  ownerResponse: {
    message: {
      type: String,
      default: ''
    },
    respondedAt: {
      type: Date
    }
  },
  cancellationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
