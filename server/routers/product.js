const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Category = require('../../models/category');
const Merchant = require('../../models/merchant');
const {protect} = require('../middlewares/verify');
const {roleAuth} = require('../middlewares/verify');

//NOTE:: Product creation route
router.post('/add/product', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const { name,productCode,description,price,discount,stock,images,category,merchant,tags,specifications,status } = req.body;

    //NOTE:: Request body validation
    if(!name) {
      return res.status(400).json({status: false, message: "Product name is required"});
    }
    if(!productCode) {
      return res.status(400).json({status: false, message: "Product code is required"});
    }
    if(!price) {
      return res.status(400).json({status: false, message: "Product price is required"});
    }
    if(!stock) {
      return res.status(400).json({status: false, message: "Product stock is required"});
    }
    if(!images) {
      return res.status(400).json({status: false, message: "Product images is required"});
    }
    if(!category) {
      return res.status(400).json({status: false, message: "Product category is required"});
    }
    if(!merchant) {
      return res.status(400).json({status: false, message: "Merchant is required"});
    }

    //NOTE:: Get category and merchant documents
    const getCategory =  await Category.findOne({ name: category });
    const getMerchant = await Merchant.findOne({ name: merchant });

    //NOTE:: Product object and creation
    const product = new Product({
      ...req.body,
      category: getCategory._id, 
      merchant: getMerchant._id
    });
    await product.save();

    return res.status(201).json({status: true, message: "Product Added Succesfully"});

  } catch(error) {
    //NOTE:: Error
    return res.status(500).json({status: false, message: "Product Add Failed"});
  }
});

//NOTE:: Get all product route
router.get('/get/product',  protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const getProduct = await Product.find()
          .populate('category')
          .populate('merchant')
    
    return res.status(200).json({status: true, data: getProduct });

  } catch(error) {
    //NOTE:: Error
    return res.status(500).json({status: false, message: "Get Product Failed"});
  }
});

module.exports = router;

