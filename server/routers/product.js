const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Category = require('../../models/category');
const {} = require('../controllers/product');
const {protect} = require('../middlewares/verify');
const {roleAuth} = require('../middlewares/verify');

router.post('/add/product', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const {name,productCode,description,price,discount,stock,images,category,tags,specifications,status} = req.body;

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

    const getCategory =  await Category.findOne({categoryCode:category});

    if(!getCategory) {
      return res.status(404).json({status: true, message: "Category Not Found"});
    }
  
    const product = new Product({
      ...req.body,
      category: getCategory?._id, 
    });
    await product.save();

    return res.status(201).json({status: true, message: "Product Added Succesfully"});

  } catch(error) {
    console.log(error)
    return res.status(500).json({status: false, message: "Product Add Failed"});
  }
});

router.get('/get/product',  protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const getProduct = await Product.findOne({ name: req.query.name }).populate('category')
    
    return res.status(200).json({status: true, data: getProduct });

  } catch(error) {
    return res.status(500).json({status: false, message: "Get Product Failed"});
  }
});

module.exports = router;

