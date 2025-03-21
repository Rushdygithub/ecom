const express = require('express');
const router = express.Router();
const Varient = require('../../models/varient');
const Product = require('../../models/product');
const User = require('../../models/user');
const Tax = require('../../models/tax');
const taxCalculation = require('../../helpers/taxHelper');
const {protect} = require('../middlewares/verify');
const {roleAuth} = require('../middlewares/verify');

//NOTE:: if the product is out of stock should be restrict to create - today
//NOTE:: Product creation route
router.post('/add/varient', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    const { varientName,varientCode,description,price,stock,images,status,color,product } = req.body;

    //NOTE:: Request body validation
    if(!varientName) {
      return res.status(400).json({status: false, message: "Varient name is required"});
    }
    if(!varientCode) {
      return res.status(400).json({status: false, message: "Varient code is required"});
    }
    if(!price) {
      return res.status(400).json({status: false, message: "Varient price is required"});
    }
    if(!stock) {
      return res.status(400).json({status: false, message: "Varient stock is required"});
    }
    if(!images) {
      return res.status(400).json({status: false, message: "Varient images is required"});
    }
    if(!color) {
      return res.status(400).json({status: false, message: "Varient color is required"});
    }

    //NOTE:: Check varient is already exists
    const varientFind = await Varient.exists({ varientCode: varientCode });

    if(varientFind) {
      return res.status(400).json({status: false, message: "Varient code is already exists"});
    }
    
    //NOTE:: Get product documents (record by product name)
    const getProduct =  await Product.findOne({ name: product });

    //NOTE:: Varient object and creation
    const varient = new Varient({
      ...req.body,
      product: getProduct._id
    });
    await varient.save();

    return res.status(201).json({status: true, message: "Varient Added Succesfully"});

  } catch(error) {
    console.log(error)
    //NOTE:: Error
    return res.status(500).json({status: false, message: "Varient Add Failed"});
  }
});

//NOTE:: Varient search - web
router.get('/varient/search/:page/:limit', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    
    //NOTE:: typeCasting string to number
    let page = parseInt(req.params.page);
    let limit= parseInt(req.params.limit);
    let skip = (page - 1) * limit;

        let search = await Varient.aggregate([
          { 
            $match: { 
              // status: 'active', 
              varientName: { $regex: req.query.name, $options: "i" }
            } 
          },
          // { color : { $contains : req.query.color }},
          // { price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } },
          // { $gt: { price: 0 } },
          { $sort: { price: -1 } }, 
          { $skip: skip }, 
          { $limit: limit }
        ]);

        const getCategory = await Varient.populate(search, {
          path: "product",
          populate: {
            path: "category" 
          }
        });
        
        //NOTE:: Tax calculation - implementaion
        search = await taxCalculation(search);

        //NOTE:: Recent search - implementaion
        const getUser = await User.findById({_id: req.user._id});
        let searchTerm = getUser.recentlySearches;

        if(searchTerm.length === 5) {
          searchTerm.shift();
          searchTerm.push(req.query.name)
          searchTerm = [...new Set(searchTerm)];
        } else {
          searchTerm.push(req.query.name)
          searchTerm = [...new Set(searchTerm)];
        }

        let data = {
          recentlySearches: searchTerm
        }

        const updateRecentSearch = await User.updateOne(
          { _id: req.user._id }, 
          { $set: data } 
        );
        
        return res.status(200).json({status: true, data: search });

  } catch(error) {
    console.log(error)
    return res.status(500).json({status: false, message: "Varient Search Failed"});
  }
});


module.exports = router;