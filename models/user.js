const mongoose = require('mongoose');

//NOTE:: User Schema
const userSchema = new mongoose.Schema({
   firstName: {
    type: String,
    trim: true
   },
   lastName: {
    type: String,
    trim: true
   },
   email: {
    type: String,
    trim: true
   },
   username: {
    type: Number,
    trim: true,
    min: 10,
    description: "must be a string (3 to 20 chars) and is required"
   },
   password: {
    type: String
   },
   recentlySearches: {
    type: [String]
   },
   role: {
      type: String,
      enum : ["Admin","Customer"],
      default: 'Customer'
   }
});

module.exports = mongoose.model("user", userSchema);