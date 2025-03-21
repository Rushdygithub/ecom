const express = require('express');
const router = express.Router();
const Tax = require('../../models/tax');
const Category = require('../../models/category');
const {protect} = require('../middlewares/verify');
const {getJwtTokenWithCookie,roleAuth} = require('../middlewares/verify');

module.exports = router;

//NOTE:: Add new tax rate route
router.post('/add/tax-rate', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    //NOTE:: Request body validation
    if(!req.body.taxRate) {
      return res.status(400).json({status: false, message: "Tax rate is required"});
    }

    //NOTE:: Get category id by name
    const getCategoryId = await Category.findOne({ name: req.body.category });

    if(!getCategoryId) {
      return res.status(400).json({status: false, message: "Category does not exsits"});
    }

    //NOTE:: Request object
    const tax = new Tax({
      ...req.body,
      category: getCategoryId._id
    });

    //NOTE:: Store tax rate data in a collection
    const taxCreation = await tax.save();

    return res.status(201).json({status: true, message: "Tax Added Succesfully"});

  } catch(error) {
    console.log(error)
    //NOTE:: Error
    return res.status(500).json({status: false, message: "Tax added Failed"});
  }
});

module.exports = router;