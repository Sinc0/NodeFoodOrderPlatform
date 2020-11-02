//imports
const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
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
router.get('/restaurants', validation, shopController.getRestaurantList);
//router.get('/restaurants/:restaurantId', validation, shopController.getRestaurantDetail);
router.get('/', validation, shopController.getIndex);
//router.get('/cart/:restaurantId', validation, shopController.postCart);
//router.get('/cart', validation, shopController.getCart);
//router.get('/addToCart/:restaurantId&:menuItemId', validation, shopController.getAddToCart);


router.get('/restaurant/:restaurantUrl', validation, shopController.getRestaurantDetail);
//router.post('/checkout', validation, shopController.getCheckout);
router.get('/profile', validation, shopController.getProfile); 
router.get('/stripe', validation, shopController.getStripe);
router.get('/order-details/:orderId', validation, shopController.getOrderDetails);
router.all('/order-process/:orderId', validation, shopController.getOrderProcess);

router.post('/order-details/:orderId', validation, shopController.postOrderDetails);
router.get('/orders-unconfirmed', shopController.getUnconfirmedOrders);
router.get('/orders-confirmed', shopController.getConfirmedOrders);
router.get('/orders-completed', shopController.getCompletedOrders);
router.post('/order-update', shopController.postOrderUpdate);
router.post('/webhook', shopController.postWebhook);

router.post('/user-update-credentials', validation, shopController.postUserUpdateCredentials);


//router.get('/cart/:restaurantId', validation, shopController.postCart);
router.get('/orders', validation, shopController.getOrders);
router.post('/order-post', validation, shopController.postOrder);
router.get('/reciepts/:orderId', validation, shopController.getReciept);
router.all('/checkout', validation, shopController.getCheckout);
router.get('/logout', validation, shopController.getLogout);
router.post('/logout-post', validation, shopController.postLogout);

//restaurant
router.get('/portal', restaurantValidation, shopController.getRestaurantIndex);
router.get('/portal/orders/accept', restaurantValidation, shopController.getRestaurantOrdersAccept);
router.get('/portal/orders/completed', restaurantValidation, shopController.getRestaurantOrdersCompleted);
router.get('/portal/orders/declined', restaurantValidation, shopController.getRestaurantOrdersDeclined);
router.get('/portal/orders/chef', restaurantValidation, shopController.getRestaurantOrdersChef);
router.get('/portal/menu/show', restaurantValidation, shopController.getRestaurantMenuShow);
router.get('/portal/menu/edit', restaurantValidation, shopController.getRestaurantMenuEdit);
router.get('/portal/stats', restaurantValidation, shopController.getRestaurantStats);
router.get('/portal/reviews', restaurantValidation, shopController.getRestaurantReviews);

router.get('/portal/settings', restaurantValidation, shopController.getRestaurantSettings);
router.get('/portal/logout', restaurantValidation, shopController.getRestaurantLogout);

router.post('/portal/updateMenu', restaurantValidation, shopController.postRestaurantUpdateMenu);
router.post('/portal/menuListed', restaurantValidation, shopController.postRestaurantMenuListed);
router.post('/portal/menuOnline', restaurantValidation, shopController.postRestaurantMenuOnline);
router.post('/portal/welcomeMessage', restaurantValidation, shopController.postRestaurantWelcomeMessage);


//tests
router.post('/review-post', validation, shopController.postRestaurantReview);
router.get('/googleMapsApiTest', validation, shopController.getGoogleMapsApiTest);
//router.get('/test', shopController.getTest);
router.post('/paypalCreateOrder', validation, shopController.getPayPalCreateOrder);
router.get('/paypalSuccess', validation, shopController.getPayPalSuccess);
router.get('/paypalCancel', validation, shopController.getPayPalCancel);

//exports
module.exports = router;