//imports
const express = require('express');
const shopController = require('../controllers/user');
const router = express.Router();
const validation = require('../validation/userValidation');



//no validation
router.post('/register-post', shopController.postRegister);
router.post('/register-restaurant-post', shopController.postRegisterRestaurant);
router.get('/register', shopController.getRegister);
router.post('/login-post', shopController.postLogin);
router.get('/login', shopController.getLogin);
router.get('/about', shopController.getAbout);
router.get('/contact', shopController.getContact);

//user validation
router.get('/', validation, shopController.getIndex);
router.get('/restaurants', validation, shopController.getRestaurantList);
router.get('/restaurant/:restaurantUrl', validation, shopController.getRestaurantDetail);
router.get('/profile', validation, shopController.getProfile); 
router.get('/orders', validation, shopController.getOrders);
router.get('/order-details/:orderId', validation, shopController.getOrderDetails);
router.all('/order-process/:orderId', validation, shopController.getOrderProcess);
router.get('/logout', validation, shopController.getLogout);
router.all('/checkout', validation, shopController.getCheckout);
router.post('/order-update', shopController.postOrderUpdate);
router.post('/user-update-credentials', validation, shopController.postUserUpdateCredentials);
router.post('/user-update-password', validation, shopController.postUserUpdatePassword);
router.post('/order-post', validation, shopController.postOrder);
router.post('/logout-post', validation, shopController.postLogout);
router.post('/webhook', shopController.postWebhook);
router.post('/review-post', validation, shopController.postRestaurantReview);

//tests
//router.get('/googleMapsApiTest', validation, shopController.getGoogleMapsApiTest);
//router.get('/stripe', validation, shopController.getStripe);
//router.get('/paypalTest', shopController.getTest);
router.post('/paypalCreateOrder', validation, shopController.getPayPalCreateOrder);
router.get('/paypalSuccess', validation, shopController.getPayPalSuccess);
router.get('/paypalCancel', validation, shopController.getPayPalCancel);

//exports
module.exports = router;