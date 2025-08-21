const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: [true, 'Property ID is required'],
    trim: true
  },
  userAddress: {
    type: String,
    required: [true, 'User wallet address is required'],
    trim: true,
    lowercase: true
  },
  liked: {
    type: Boolean,
    required: true,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index to ensure one like per user per property
likeSchema.index({ propertyId: 1, userAddress: 1 }, { unique: true });

// Index for efficient querying
likeSchema.index({ propertyId: 1 });
likeSchema.index({ userAddress: 1 });
likeSchema.index({ liked: 1 });
likeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Like', likeSchema);
