//imports
const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const validation = require('../validation/userValidation');

//variables


//route handling admin validation
router.get('/add-product', validation, adminController.addProduct);

router.get('/product-list', validation, adminController.getProducts)

router.post('/product', validation, adminController.postProduct);

router.get('/edit-product/:productId', validation, adminController.getEditProduct)

router.post('/edit-product-post', validation, adminController.postEditProduct)

router.post('/delete-product/:productId', validation, adminController.postDeleteProduct);

router.get('/delete-order/:orderId', validation, adminController.postDeleteOrder);

router.get('/order-list', validation, adminController.getOrderList);

//route handling end

//exports
module.exports = router;

