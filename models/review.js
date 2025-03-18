const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true
  },
  rate: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  varient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'varient',
    required: true
  }
});

module.exports = mongoose.model("review", reviewSchema);