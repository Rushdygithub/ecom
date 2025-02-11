const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String
  },
  categoryCode: {
    type: String
  },
  description: {
    type: String
  },
  image: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("category", categorySchema);