//imports
const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const validation = require('../validation/userValidation');



//route handling no validation
router.post('/register-post', shopController.postRegister)

router.get('/register', shopController.getRegister)

router.post('/login-post', shopController.postLogin)

router.get('/login', shopController.getLogin)



//route handling user validation
router.get('/product-list', validation, shopController.getProducts);

router.get('/products/:productId', validation, shopController.getProductDetail);

router.get('/', validation, shopController.getIndex);


router.get('/cart/:productId', validation, shopController.postCart);

router.get('/cart', validation, shopController.getCart);


router.get('/restaurant/:productId', validation, shopController.getRestaurant);
router.get('/addToCart/:productId&:menuItemId', validation, shopController.getAddToCart);


router.get('/cart/:productId', validation, shopController.postCart);

router.get('/orders', validation, shopController.getOrders);

router.post('/order-post', validation, shopController.postOrder);

router.get('/reciepts/:orderId', validation, shopController.getReciept);


router.get('/checkout', validation, shopController.getCheckout);


router.get('/logout', validation, shopController.getLogout);

router.post('/logout-post', validation, shopController.postLogout);



//exports
module.exports = router;