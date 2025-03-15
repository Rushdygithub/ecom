const mongoose = require('mongoose');
const getSLTDate = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
};

const otpSchema = new mongoose.Schema({
  otp: {
    type: String, 
    trim: true,
    minlength: 4,  
    required: true
  },
  email: {
    type: String,
    trim: true
  }
  // createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 minutes
});

module.exports = mongoose.model("otp", otpSchema);
