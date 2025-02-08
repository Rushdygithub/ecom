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
    trim: true
   },
   recentlySearches: {
    type: [String]
   }
});



module.exports = mongoose.model("User", userSchema)