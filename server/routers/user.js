const express = require('express');
const app = express();
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');

//NOTE:: User Sign-Up Fucntion
router.post('/sign-up', async (req,res) => {
   try {
      let {firstName,lastName,email,username,password} = req.body;
      //NOTE:: Request body validation
      if(!firstName) {
        return res.status(400).json({status: false, message: "firstName filed is required"});
      } 
      if(!lastName) {
         return res.status(400).json({status: false, message: "lastName filed is required"});
      } 
      if(!email) {
         return res.status(400).json({status: false, message: "email filed is required"});
      } 
      if(!username) {
         return res.status(400).json({status: false, message: "username filed is required"});
      } 
      if(!password) {
         return res.status(400).json({status: false, message: "password filed is required"});
      } 

      //NOTE:: Regex Handlling 
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!regex.test(email)) {
         return res.status(400).json({status: false, message: "please enter a valid email"});
      }

      const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      if(!passwordRegex.test(password)) {
         return res.status(400).json({status: false, message: "please enter a strong password"});
      }

      //NOTE:: Check username or email already exsists or not
      const emailExists = await User.exists({email: email});
      const userNameExists = await User.exists({username: username});
      if(emailExists || userNameExists) {
         return res.status(400).json({status: false, message: "email or username is already taken"});
      }

      //NOTE:: Encypt the user password
      let saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hashPassword = await bcrypt.hashSync(password, salt);
      req.body.password = hashPassword;

      //NOTE:: Create user method
      const user = new User(req.body);
      await user.save();
      return res.status(201).json({status: true, message: "Signup Succesfull"});

   } catch(error) {
      console.log(error)
      return res.status(500).json({status: false, message: error})
   }
});

//NOTE:: User Sign-Up fucntion
router.post('/auth/login', async (req,res) => {
   try {
     
   } catch(error) {
      return res.status(500).json({status: false, message: error})
   }
});

module.exports = router;