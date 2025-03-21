const Tax = require('../models/tax');
const Category = require('../models/category');
const Product = require('../models/product');
const Varient = require('../models/varient');

const taxHelperFunction = async () => { }

const taxCalculation = async (search) => {

  let arr = [];
  for(let element of search) {
    if(element.product.category.name === 'Electronics') {

      let findCategoryId = await Category.find({ name: 'Electronics' });
      const getTax = await Tax.find({category: findCategoryId[0]._id });
      // console.log(getTax[0].taxRate,"El")

      element.price = element.price * Number((1 + getTax[0].taxRate / 100));  
      arr.push(element)
    } 
    if(element.product.category.name === 'Home & Living') {
      let findCategoryId = await Category.find({ name: 'Home & Living' });
      const getTax = await Tax.find({category: findCategoryId[0]._id });
      // console.log(getTax[0].taxRate,"Home")

      element.price = element.price * Number((1 + getTax[0].taxRate / 100));  
      arr.push(element)
    }
  }

  return arr;
}

module.exports = taxCalculation;
