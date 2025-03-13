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
});

module.exports = mongoose.model("Otp", otpSchema);
