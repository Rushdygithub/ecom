const express = require('express');
const app = express();
const router = express.Router();
const User = require('../../models/user');
const OTP = require('../../models/otp');
const bcrypt = require('bcrypt');
const {signUpController} = require('../controllers/user');
const {protect} = require('../middlewares/verify');
const {getJwtTokenWithCookie,roleAuth} = require('../middlewares/verify');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

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
      let user = new User(req.body);
      await user.save();

      const userToken = await getJwtTokenWithCookie(user,201,req,res);

   } catch(error) {
      return res.status(500).json({status: false, message: error });
   }

});

//NOTE:: User Sign-In fucntion
router.post('/auth/login',  async (req,res) => {

   try {
      let { username, email, password } = req.body;
      
      //NOTE:: Request body validation
      if(!email && !username) {
         return res.status(400).json({status: false, message: "Please enter your username or email"});
      }
      if(!password) {
         return res.status(400).json({status: false, message: "Please enter your paasword"});
      }

      //NOTE:: If user login with email and password - (Controller)
      await signUpController(req,res,req.body);

   } catch(error) {
      return res.status(500).json({status: false, message: 'Internal Server Error'});
   }

});

//NOTE:: Send OTP function
router.post('/send/otp',  async (req,res) => {

   try {
      
      if(!req.body.email) {
         return res.status(400).json({status: false, message: "Please enter the email address"});
      } 

      //    const smtpTransports = nodemailer.createTransport({
      //       service: "Gmail",
      //       host: "smtp.gmail.com",
      //       port: 587,
      //       secure: true,
      //       auth: {
      //         user: '',
      //         pass: '',
      //       },
      //     });

      //     var mailOptions = {
      //       from: '',
      //       to: '', 
      //       subject: ' | new message test !',
      //       text: 'test'
      //   }
      //   smtpTransports.sendMail(mailOptions, function(error, response){
      //       if(error){
      //           console.log(error);
      //       }else{
      //           res.redirect('/');
      //       }
      //   });

      //NOTE:: OTP generation
      const otpGen = Math.floor(100000 + Math.random() * 900000);

      //NOTE:: Send otp to collection
      const otp = await OTP.findOne({ email: req.body.email });

      if(!otp) {
         //NOTE:: Store the OTP number in a collection
         let createOtp = new OTP({ email: req.body.email , otp: otpGen });
         await createOtp.save();

         return res.status(201).json({status: true, account: 'OTP has been sent to your email' });   
      }

      return res.status(200).json({status: true, account: 'OTP is already sent, Please check the email'});   
      
   } catch(error) {
      console.log(error)
      return res.status(500).json({status: false, message: 'Internal Server Error'});
   }

});

//NOTE:: Verify OTP
router.post('/verify/otp',  async (req,res) => {

   try {
      
      const { email, otp } = req.body;
      //NOTE:: Check the email id is valid or not
      const emailFind = await OTP.find({ email: email });

      if(emailFind[0].email) {
         //NOTE:: Verify OTP
         if(emailFind[0].otp === otp) {

            //NOTE:: This will remove the OTP after 5 minute
            setTimeout(async () => {
               await OTP.deleteOne({ email: email });
           }, 300000);

            //NOTE:: OTP is valid
            return res.status(200).json({ status:true, message:'OTP veryfied success' });     
         } else {
            //NOTE:: OTP is invalid
            return res.status(401).json({ status:true, message:'OTP verify filed' });     
         }
      } 

   } catch(error) {
      return res.status(401).json({status: false, message: 'OTP has been expired'});
   }

});

//NOTE:: Get user account details function
router.get('/account',  protect, roleAuth("Customer"), async (req,res) => {

   try {
      let account = await User.findById(req.user._id);
      return res.status(201).json({status: true, account: account });   
   } catch(error) {
      return res.status(500).json({status: false, message: 'Internal Server Error'});
   }

});

module.exports = router;