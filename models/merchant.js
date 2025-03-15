const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String
  },
  description: {
    type: String
  },
  mobile: {
    type: Number
  },
  address: {
    type: String
  }
});

module.exports = mongoose.model("Merchant", merchantSchema);
