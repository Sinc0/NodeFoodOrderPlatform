//imports
const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const validation = require('../validation/userValidation');
const stripe = require("stripe")("");

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


router.get('/restaurant/:productUrl', validation, shopController.getRestaurant);
router.get('/addToCart/:productId&:menuItemId', validation, shopController.getAddToCart);
//router.post('/checkout', validation, shopController.getCheckout);
router.get('/profile', validation, shopController.getProfile); 
router.get('/stripe', validation, shopController.getStripe);
router.get('/order-details/:orderId', validation, shopController.getOrderDetails);
router.post('/order-details/:orderId', shopController.postOrderDetails);
router.all('/order-process/:orderId', validation, shopController.getOrderProcess);
router.post('/webhook', shopController.postWebhook);
router.get('/order-confirm', shopController.getConfirmOrder);
router.post('/order-update', shopController.postOrderUpdate);


router.get('/cart/:productId', validation, shopController.postCart);

router.get('/orders', validation, shopController.getOrders);

router.post('/order-post', validation, shopController.postOrder);

router.get('/reciepts/:orderId', validation, shopController.getReciept);


router.all('/checkout', validation, shopController.getCheckout);


router.get('/logout', validation, shopController.getLogout);

router.post('/logout-post', validation, shopController.postLogout);



//exports
module.exports = router;