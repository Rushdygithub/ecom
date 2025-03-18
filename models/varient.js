const mongoose = require('mongoose');

const varientSchema = new mongoose.Schema({
  varientName: {
    type: String,
  },
  varientCode: {
    type: String
  },
  description: {
    type: String
  },
  stock: {
    type: Number,
  },
  color: [{
    type: String
  }],
  price: {
    type: String
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  }
});

module.exports = mongoose.model("varient", varientSchema);