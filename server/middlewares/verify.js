const jwt = require('jsonwebtoken');
require('dotenv').config();

//NOTE:: Verify token
const tokenVerify = async (req,res,next) => {
  try {
    const token = req.headers.token;
    if(!token) {
      return res.status(401).json({status: false, message: "Token "})
    }
    jwt.verify(token,  process.env.JWT_SECRET);
    next()
  } catch(error) {
    return res.status(401).json({error: error })
  }
 
}

module.exports = tokenVerify;