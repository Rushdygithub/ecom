const express = require('express');
const router = express.Router();
const Merchant = require('../../models/merchant');
const {roleAuth,protect} = require('../middlewares/verify');

//NOTE:: Add new merchant route
router.post('/add/merchant', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const { name, email, description, mobile, address } = req.body;
    //NOTE:: Request body validation
    if(!name) {
      return res.status(400).json({status: false, message: "Product name is required"});
    }
    if(!email) {
      return res.status(400).json({status: false, message: "Email is required"});
    }
    if(!mobile) {
      return res.status(400).json({status: false, message: "Mobile is required"});
    }
    if(!address) {
      return res.status(400).json({status: false, message: "Address is required"});
    }

    //NOTE:: Store merchant data in a collection
    const merchantCreation = new Merchant(req.body);
    await merchantCreation.save();

    return res.status(201).json({status: true, message: "Merchant Added Succesfully"});

  } catch(error) {
    return res.status(500).json({status: false, message: "Merchant added Failed"});
  }
});

//NOTE:: Get all category route
router.get('/get/merchant', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    //NOTE:: Get all merchant from the collection
    const getMerchant = await Merchant.find();
    
    return res.status(200).json({status: true, data: getMerchant });

  } catch(error) {
    return res.status(500).json({status: false, message: "Get Merchant Failed"});
  }
});

//NOTE:: Update category route
router.put('/merchant/:id', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    
    const { name, email, description, mobile, address } = req.body;
    //NOTE:: req body object
    const data = {
      name,
      email,
      description,
      mobile,
      address
    };

    //NOTE:: Update merchant document by merchant id
    const updateMerchant = await Merchant.updateOne(
      { _id: req.params.id }, 
      { $set: data } 
    );
    
    return res.status(200).json({status: true, data: updateMerchant });

  } catch(error) {
    return res.status(500).json({status: false, message: "Update Merchant Failed"});
  }
});

//NOTE:: Get merchant by id route
router.delete('/merchant/delete/:id', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    //NOTE:: Delete mongooese query by id
    const deleteDocument = await Merchant.deleteOne({ _id: req.params.id });
    
    return res.status(200).json({status: true, data: deleteDocument });

  } catch(error) {
    return res.status(500).json({status: false, message: "Remove Merchant Failed"});
  }
});

module.exports = router;
