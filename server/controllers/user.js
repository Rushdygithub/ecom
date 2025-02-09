const User = require('../../models/user');
const bcrypt = require('bcrypt');
const {getJwtTokenWithCookie} = require('../middlewares/verify');

//NOTE:: Sign-Up controller
const signUpController = async (req,res,data,password) => {
    //NOTE:: If user login with email and password
    const regexNum = /^-?\d[0-9.e]*$/
 
    if(regexNum.test(data)) {
      if(data) {
        let user = await User.findOne({ username: data });
           if(user) {
              let check = await bcrypt.compare(password, user.password);
                 if(check) {
                    await getJwtTokenWithCookie(user,201,req,res);
                 } 
           } 
      }    
   }
   else {
   //NOTE:: If user login with username and password
   let mail = await User.findOne({ email: data });
   if(mail) {
      let check = await bcrypt.compare(password, mail.password);
         if(check) {
            await getJwtTokenWithCookie(mail,201,req,res);
         } 
        }
  }
}

module.exports = {
   signUpController
}

