const User = require('../../models/user');
const bcrypt = require('bcrypt');
const {getJwtTokenWithCookie} = require('../middlewares/verify');

//NOTE:: Sign-Up controller
const signUpController = async (req, res, data) => {

   //NOTE:: If it is a email this code block will excute
   if(data.email) {

      //NOTE:: Mongoose query for find user by email
      let user = await User.findOne({ email: data.email });

            if(user) {

            //NOTE:: Password comparison
            let password = await bcrypt.compare(data.password, user.password);
            
            if(password) {
               //NOTE:: Token issue
               await getJwtTokenWithCookie(user, 201, req, res);
            } else {
               //NOTE:: Error
               return res.status(401).json({status: false, message: 'Please enter your correct password'});
            }

            } else {
               //NOTE:: Error
               return res.status(401).json({status: false, message: 'Please enter your correct email address'});
            }
   } 
   else {
      //NOTE:: Mongoose query for find user by mobile
      let user = await User.findOne({ username: data.username });

          if (user) {

            //NOTE:: Password comparison
            let password = await bcrypt.compare(data.password, user.password);

            if (password) {
             //NOTE:: Token issue
              await getJwtTokenWithCookie(user, 201, req, res);
            } else {
            //NOTE:: Error
               return res.status(401).json({status: false, message: 'Please enter your correct password'});
            }

          } else {
            //NOTE:: Error
            return res.status(401).json({status: false, message: 'Please enter your correct mobile number'});
          }
   }
   
 };
 

module.exports = {
   signUpController
}
