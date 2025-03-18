const User = require('../../models/user');
const bcrypt = require('bcrypt');
const {getJwtTokenWithCookie} = require('../middlewares/verify');

//NOTE:: Sign-Up controller
const loginController = async (req, res, data) => {

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

               // let currentTime = new Date();
               // let timeCurrent = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
               
               // //NOTE:: Account block after 5 attempt
               // const updateAttCount = { $inc: { failed_attempts : 1 }};
               // const search = await User.findOne({ email: data.email });

               // const filter = { email: data.email };
               // if(search.failed_attempts === 5) {
                  
               //    const updateTime = { 
               //       attempts_time: currentTime,
               //       failed_attempts: 0
               //    }
               //    let updateAttemptCount = await User.findOneAndUpdate(filter, updateTime );
                  
               // }

               //    let time = new Date(search.attempts_time);
               //    let con = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

               //    let currentDate = new Date();
               //    let currentTimeObj = new Date(currentDate.toDateString() + ' ' + timeCurrent);
               //    let conTimeObj = new Date(currentDate.toDateString() + ' ' + con);

               //    let differenceInMillis = currentTimeObj - conTimeObj;
               //    let min = Math.floor(differenceInMillis / (1000*60))
               //    console.log(min)

            
               // let updateAttemptCount = await User.findOneAndUpdate(filter, updateAttCount, { new: true });

               // if(min < 2) {
               //   return res.status(401).json({status: false, message: 'Please enter your correct password'});
                  
               // } else {
               //    return res.status(401).json({status: false, message: 'Your account has been blocked, unlock after 5 minutes'});
               // }
               // console.log(d)
               //NOTE:: Error
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
   loginController
}
