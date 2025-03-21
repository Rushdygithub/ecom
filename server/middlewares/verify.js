const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../../models/user');

// NOTE:: Access token fucntion
const getJwtToken = async (user) => {
  // console.log(user._id)
  return jwt.sign({user: user._id }, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRESIN })
}

// NOTE:: Token for coockie (response)
const getJwtTokenWithCookie = async (user,statusCode,req,res) => {

    const token = await getJwtToken(user);
    
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRESIN * 24 * 60),
      httpOnly:true
    }

    if(req.originalUrl !== '/user/sign-up') {
    return res.status(statusCode).cookie('token', token, options).json({
        status: true,
        token: token
    });
    } else {
      return res.status(200).json({status: true, message:"User Register Success" });
    } 

}

//NOTE:: Verify token
const protect = async (req,res,next) => {
  try {

    const token = req.headers.token;
    if(!token) {
      return res.status(401).json({status: false, message: "Access Denied"})
    }

    // else if(res.cookie.token) {}
    let decoded = jwt.verify(token,  process.env.JWT_SECRET);
    // console.log("id",decoded.user)
    req.user = await User.findById(decoded.user);
    next();
   
  } catch(error) {
    // console.log(error)
    if(error.name === 'TokenExpiredError') {
      return res.status(401).json({status: false, message: "Your token has been expired"})
    }
    return res.status(401).json({error: error });
  }
}

//NOTE:: Role base authountication
const roleAuth = (...role) => {
  return (req, res, next) => {
    if(!role.includes(req.user.role)) {
      return res.status(401).json({status: false, message: "Anuthorized"})
    }
    next()
}
}

module.exports = {
  getJwtTokenWithCookie,
  protect,
  roleAuth
};