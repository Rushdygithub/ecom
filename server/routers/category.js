const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const Product = require('../../models/product');
const {} = require('../controllers/product');
const {protect} = require('../middlewares/verify');
const {roleAuth} = require('../middlewares/verify');

router.post('/add/category', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const {name,productCode,categoryCode,image} = req.body;

    //NOTE:: Request body validation
    if(!name) {
      return res.status(400).json({status: false, message: "Product name is required"});
    }
    if(!productCode) {
      return res.status(400).json({status: false, message: "Product code is required"});
    }
    if(!categoryCode) {
      return res.status(400).json({status: false, message: "CategoryCode is required"});
    }
    if(!image) {
      return res.status(400).json({status: false, message: "Product image is required"});
    }

    let productCategory = new Category(req.body);
    await productCategory.save();

    return res.status(201).json({status: true, message: "Category Added Succesfully"});

  } catch(error) {
    return res.status(500).json({status: false, message: "Category Fdded Failed"});
  }
});

router.get('/get/category', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {

    const getCategory = await Category.findOne({ name: req.query.name });
    
    return res.status(200).json({status: true, data: getCategory });

  } catch(error) {
    return res.status(500).json({status: false, message: "Get Category Failed"});
  }
});

module.exports = router;
