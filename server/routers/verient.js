const express = require('express');
const router = express.Router();
const Varient = require('../../models/varient');
const Product = require('../../models/product');
const {protect} = require('../middlewares/verify');
const {roleAuth} = require('../middlewares/verify');

//NOTE:: if the product is out of stock should be restrict to create 
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

    //NOTE:: Get product documents (record by product name)
    const getProduct =  await Product.findOne({ name: product });
    // console.log("=",getProduct)

    //NOTE:: Varient object and creation
    const varient = new Varient({
      ...req.body,
      product: getProduct._id
    });
    await varient.save();

    return res.status(201).json({status: true, message: "Varient Added Succesfully"});

  } catch(error) {
    //NOTE:: Error
    return res.status(500).json({status: false, message: "Varient Add Failed"});
  }
});

//NOTE:: Varient search - web
router.get('/varient/search/:page/:limit', protect, roleAuth("Admin","Customer"), async (req,res) => {
  try {
    
    //NOTE:: typeCasting
    let page = parseInt(req.params.page);
    let limit= parseInt(req.params.limit);

    let skip = (page - 1) * limit;
    //NOTE:: Skip or offset
    //NOTE:: offset formula - (page - 1) * limit; 
    //Let's say client request the 2 page and limit is 20 here the first page has now 20 and the 2 page limit from limit number 21 to 30
    //Devide limits in previos pages equively
    //This is how work pagination
    const search = await Varient.aggregate([
      { 
        $match: { 
          status: 'active', 
          varientName: { $regex: req.query.name, $options: "i" }, 
          // Uncomment if filtering by color is needed
          // color: { $regex: req.query.color, $options: "i" }

        } 
      },
      // { color : { $contains : req.query.color }},
      // { price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } },
      // { $gt: { price: 0 } },
      { $sort: { price: -1 } }, 
      { $skip: skip }, 
      { $limit: limit }
    ]);

    //NOTE:: Recent search
    

    return res.status(200).json({status: true, data: search });

  } catch(error) {
    console.log(error)
    return res.status(500).json({status: false, message: "Varient Search Failed"});
  }
});


module.exports = router;