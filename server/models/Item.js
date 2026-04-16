const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
    type: String,
    enum: [
      'Electronics', 'Books', 'Clothing', 'Accessories',
      'Documents', 'Keys', 'Bags', 'Jewellery',
      'Vehicles', 'Other'
    ],
    required: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'matched', 'returned', 'rejected'],
    default: 'active'
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matches: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      score: { type: Number }
    }
  ],
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);