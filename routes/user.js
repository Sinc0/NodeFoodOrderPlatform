//imports
const path = require('path');
const express = require('express');
const shopController = require('../controllers/user');
const router = express.Router();
const validation = require('../validation/userValidation');
const restaurantValidation = require('../validation/restaurantValidation');
const stripe = require("stripe")("");

//route handling no validation
router.post('/register-post', shopController.postRegister);
router.post('/register-restaurant-post', shopController.postRegisterRestaurant);
router.get('/register', shopController.getRegister);
router.post('/login-post', shopController.postLogin);
router.get('/login', shopController.getLogin);
router.get('/about', shopController.getAbout);
router.get('/contact', shopController.getContact);

//route handling user validation
router.get('/', validation, shopController.getIndex);
router.get('/restaurants', validation, shopController.getRestaurantList);
router.get('/restaurant/:restaurantUrl', validation, shopController.getRestaurantDetail);
router.get('/profile', validation, shopController.getProfile); 
router.get('/orders', validation, shopController.getOrders);
router.get('/order-details/:orderId', validation, shopController.getOrderDetails);
router.all('/order-process/:orderId', validation, shopController.getOrderProcess);
router.get('/logout', validation, shopController.getLogout);
router.all('/checkout', validation, shopController.getCheckout);
// router.get('/reciepts/:orderId', validation, shopController.getReciept);
// router.get('/orders-unconfirmed', shopController.getUnconfirmedOrders);
// router.get('/orders-confirmed', shopController.getConfirmedOrders);
// router.get('/orders-completed', shopController.getCompletedOrders);
router.post('/order-update', shopController.postOrderUpdate);
router.post('/user-update-credentials', validation, shopController.postUserUpdateCredentials);
router.post('/user-update-password', validation, shopController.postUserUpdatePassword);
router.post('/order-post', validation, shopController.postOrder);
router.post('/logout-post', validation, shopController.postLogout);
router.post('/webhook', shopController.postWebhook);
router.post('/review-post', validation, shopController.postRestaurantReview);

//restaurant portal
router.get('/restaurantPortal', restaurantValidation, shopController.getRestaurantIndex);
router.get('/restaurantPortal/orders/accept', restaurantValidation, shopController.getRestaurantOrdersAccept);
router.get('/restaurantPortal/orders/completed', restaurantValidation, shopController.getRestaurantOrdersCompleted);
router.get('/restaurantPortal/orders/declined', restaurantValidation, shopController.getRestaurantOrdersDeclined);
router.get('/restaurantPortal/orders/chef', restaurantValidation, shopController.getRestaurantOrdersChef);
router.get('/restaurantPortal/menu/show', restaurantValidation, shopController.getRestaurantMenuShow);
router.get('/restaurantPortal/menu/edit', restaurantValidation, shopController.getRestaurantMenuEdit);
router.get('/restaurantPortal/stats', restaurantValidation, shopController.getRestaurantStats);
router.get('/restaurantPortal/reviews', restaurantValidation, shopController.getRestaurantReviews);
router.get('/restaurantPortal/settings', restaurantValidation, shopController.getRestaurantSettings);
router.get('/restaurantPortal/logout', restaurantValidation, shopController.getRestaurantLogout);
router.post('/restaurantPortal/updateMenu', restaurantValidation, shopController.postRestaurantUpdateMenu);
router.post('/restaurantPortal/menuListed', restaurantValidation, shopController.postRestaurantMenuListed);
router.post('/restaurantPortal/menuOnline', restaurantValidation, shopController.postRestaurantMenuOnline);
router.post('/restaurantPortal/welcomeMessage', restaurantValidation, shopController.postRestaurantWelcomeMessage);

//tests
//router.get('/googleMapsApiTest', validation, shopController.getGoogleMapsApiTest);
//router.get('/stripe', validation, shopController.getStripe);
//router.get('/paypalTest', shopController.getTest);
router.post('/paypalCreateOrder', validation, shopController.getPayPalCreateOrder);
router.get('/paypalSuccess', validation, shopController.getPayPalSuccess);
router.get('/paypalCancel', validation, shopController.getPayPalCancel);

//exports
module.exports = router;