const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const {roleAuth,protect} = require('../middlewares/verify');

//NOTE:: Add new category route
router.post('/add/category', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const { name, categoryCode,image } = req.body;
    //NOTE:: Request body validation
    if(!name) {
      return res.status(400).json({status: false, message: "Product name is required"});
    }
    if(!categoryCode) {
      return res.status(400).json({status: false, message: "CategoryCode is required"});
    }
    if(!image) {
      return res.status(400).json({status: false, message: "Product image is required"});
    }

    //NOTE:: Store category data in a collection
    let productCategory = new Category(req.body);
    await productCategory.save();

    return res.status(201).json({status: true, message: "Category Added Succesfully"});

  } catch(error) {
    return res.status(500).json({status: false, message: "Category Fdded Failed"});
  }
});

//NOTE:: Get all category route
router.get('/get/category', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    //NOTE:: Get all category from the collection
    const getCategory = await Category.find();
    
    return res.status(200).json({status: true, data: getCategory });

  } catch(error) {
    return res.status(500).json({status: false, message: "Get Category Failed"});
  }
});

//NOTE:: Update category route
router.put('/category/:id', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const { name, description, image } = req.body;
    //NOTE:: req body object
    const data = {
      name,
      description,
      image,
    };

    //NOTE:: Update category document by category id
    const updateCategory = await Category.updateOne(
      { _id: req.params.id }, 
      { $set: data } 
    );
    
    return res.status(200).json({status: true, data: updateCategory });

  } catch(error) {
    return res.status(500).json({status: false, message: "Update Category Failed"});
  }
});

//NOTE:: Get category by id route
router.delete('/category/delete/:id', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    //NOTE:: Delete mongooese query by id
    const deleteDocument = await Category.deleteOne({ _id: req.params.id });
    
    return res.status(200).json({status: true, data: deleteDocument });

  } catch(error) {
    return res.status(500).json({status: false, message: "Remove Category Failed"});
  }
});

module.exports = router;
