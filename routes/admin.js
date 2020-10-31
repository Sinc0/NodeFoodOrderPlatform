//imports
const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const validation = require('../validation/userValidation');

//variables


//route handling admin validation
/*
router.get('/add-restaurant', validation, adminController.addRestaurant);
router.get('/restaurant-list', validation, adminController.getRestaurants)
router.post('/restaurant', validation, adminController.postRestaurant);
router.get('/edit-restaurant/:restaurantId', validation, adminController.getEditRestaurant)
router.post('/edit-restaurant-post', validation, adminController.postEditRestaurant)
router.post('/delete-restaurant/:restaurantId', validation, adminController.postDeleteRestaurant);
router.get('/delete-order/:orderId', validation, adminController.postDeleteOrder);
router.get('/order-list', validation, adminController.getOrderList);
*/

router.get('/admin/orders', validation, adminController.getOrders);
router.get('/admin/restaurants', validation, adminController.getRestaurants);
router.get('/admin/users', validation, adminController.getUsers);
router.get('/admin/reviews', validation, adminController.getReviews);
router.get('/admin/stats', validation, adminController.getStats);
router.post('/admin/edit-orders', validation, adminController.postEditOrders);
router.post('/admin/edit-restaurants', validation, adminController.postEditRestaurants);
router.post('/admin/edit-users', validation, adminController.postEditUsers);
router.post('/admin/edit-reviews', validation, adminController.postEditReviews);
//router.get('/admin/index', validation, adminController.getIndex);

//route handling end

//exports
module.exports = router;

