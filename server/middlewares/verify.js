const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../../models/user');


// NOTE:: Access token fucntion
const getJwtToken = async (user) => {
  console.log(user._id)
  return jwt.sign({id: user._id }, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRESIN })
}

// NOTE:: Token for coockie (response)
const getJwtTokenWithCookie = async (user,statusCode,req,res) => {

    const token = await getJwtToken(user);

    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRESIN * 24 * 60),
      httpOnly:true
    }

    return res.status(statusCode).cookie('token', token, options).json({
        status: true,
        token: token
    });

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
    req.user = await User.findById(decoded.id);
    next()
    // console.log('============', req.user)
   
  } catch(error) {
    return res.status(401).json({error: error })
  }
}

module.exports = {
  getJwtTokenWithCookie,
  protect
};