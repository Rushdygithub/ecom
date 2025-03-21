const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  taxRate: {
    type: Number,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  }
});

module.exports = mongoose.model("tax", taxSchema);