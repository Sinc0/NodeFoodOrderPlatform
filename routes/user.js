//imports
const express = require('express');
const shopController = require('../controllers/user');
const router = express.Router();
const userValidation = require('../validation/userValidation');



//no validation
router.get('/login', shopController.getLogin);
router.get('/about', shopController.getAbout);
router.get('/contact', shopController.getContact);
router.get('/register', shopController.getRegister);
router.post('/register-post', shopController.postRegister);
router.post('/register-restaurant-post', shopController.postRegisterRestaurant);
router.post('/login-post', shopController.postLogin);

//user validation
router.get('/', userValidation, shopController.getIndex);
router.get('/restaurants', userValidation, shopController.getRestaurantList);
router.get('/restaurant/:restaurantUrl', userValidation, shopController.getRestaurantDetail);
router.get('/profile', userValidation, shopController.getProfile); 
router.get('/orders', userValidation, shopController.getOrders);
router.get('/order-details/:orderId', userValidation, shopController.getOrderDetails);
router.all('/order-process/:orderId', userValidation, shopController.getOrderProcess);
router.get('/logout', userValidation, shopController.getLogout);
router.all('/checkout', userValidation, shopController.getCheckout);
router.post('/user-update-credentials', userValidation, shopController.postUserUpdateCredentials);
router.post('/user-update-password', userValidation, shopController.postUserUpdatePassword);
router.post('/order-post', userValidation, shopController.postOrder);
router.post('/logout-post', userValidation, shopController.postLogout);
router.post('/webhook', userValidation, shopController.postWebhook);
router.post('/review-post', userValidation, shopController.postRestaurantReview);

//tests
//router.get('/googleMapsApiTest', validation, shopController.getGoogleMapsApiTest);
//router.get('/stripe', validation, shopController.getStripe);
//router.get('/paypalTest', shopController.getTest);
router.post('/paypalCreateOrder', userValidation, shopController.getPayPalCreateOrder);
router.get('/paypalSuccess', userValidation, shopController.getPayPalSuccess);
router.get('/paypalCancel', userValidation, shopController.getPayPalCancel);

//exports
module.exports = router;