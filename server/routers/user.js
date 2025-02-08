const express = require('express');
const app = express();
const router = express.Router();
const User = require('../../models/user');

//NOTE:: User Sign-Up fucntion
router.post('/sign-up', async (req,res) => {
   try {

      const {firstName,lastName,email,username} = req.body;

      if(!firstName) {
        return res.status(400).json({status: false, message: "firstName filed is required"})
      } 
      if(!lastName) {
         return res.status(400).json({status: false, message: "lastName filed is required"})
      } 
      if(!email) {
         return res.status(400).json({status: false, message: "email filed is required"})
      } 
      if(!username) {
         return res.status(400).json({status: false, message: "username filed is required"})
      } 

      const user = new User(req.body);
      await user.save();
      
      return res.status(201).json({status: true, message: 'Signup succesfull'});
   } catch(error) {
      console.log("======error",error)
      return res.status(500).json({status: false, message: error})
   }
});

module.exports = router;