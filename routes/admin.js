//imports
const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const validation = require('../validation/userValidation');

//variables


//route handling admin validation
router.get('/add-restaurant', validation, adminController.addRestaurant);

router.get('/restaurant-list', validation, adminController.getRestaurants)

router.post('/restaurant', validation, adminController.postRestaurant);

router.get('/edit-restaurant/:restaurantId', validation, adminController.getEditRestaurant)

router.post('/edit-restaurant-post', validation, adminController.postEditRestaurant)

router.post('/delete-restaurant/:restaurantId', validation, adminController.postDeleteRestaurant);

router.get('/delete-order/:orderId', validation, adminController.postDeleteOrder);

router.get('/order-list', validation, adminController.getOrderList);

//route handling end

//exports
module.exports = router;

