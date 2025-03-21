const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const {} = require('../controllers/product');
const {protect} = require('../middlewares/verify');
const {getJwtTokenWithCookie,roleAuth} = require('../middlewares/verify');

module.exports = router;



