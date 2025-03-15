
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  productCode: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
  },
  images: [{
    type: String,
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'merchant',
    required: true
  },
  // brand: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Brand',
  //   required: true
  // },
  // seller: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Assuming sellers are users
  //   required: true
  // },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{
    type: String // Keywords for search & filtering
  }],
  specifications: {
    type: Map,
    of: String // Dynamic key-value pairs for product attributes
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
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

module.exports= mongoose.model('product', productSchema);

