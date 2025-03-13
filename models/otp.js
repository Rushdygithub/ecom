const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: String, 
    trim: true,
    minlength: 4,  
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // One-to-one relationship
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  }
});

module.exports = mongoose.model("Otp", otpSchema);
