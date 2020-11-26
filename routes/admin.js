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

//get
router.get('/admin/home', validation, adminController.getHome);
router.get('/admin/orders', validation, adminController.getOrders);
router.get('/admin/restaurants', validation, adminController.getRestaurants);
router.get('/admin/users', validation, adminController.getUsers);
router.get('/admin/reviews', validation, adminController.getReviews);
router.get('/admin/stats', validation, adminController.getStats);

//edit
router.post('/admin/edit-order', validation, adminController.postEditOrder);
router.post('/admin/edit-restaurant', validation, adminController.postEditRestaurant);
router.post('/admin/edit-user', validation, adminController.postEditUser);
router.post('/admin/edit-review', validation, adminController.postEditReview);
router.post('/admin/edit-newsPost', validation, adminController.postEditNewsPost);

//delete
router.post('/admin/delete-order', validation, adminController.postDeleteOrder);
router.post('/admin/delete-restaurant', validation, adminController.postDeleteRestaurant);
router.post('/admin/delete-user', validation, adminController.postDeleteUser);
router.post('/admin/delete-review', validation, adminController.postDeleteReview);
router.post('/admin/delete-newsPost', validation, adminController.postDeleteNewsPost);
//router.get('/admin/index', validation, adminController.getIndex);

//other
router.post('/admin/post-newsPost', validation, adminController.postNewsPost);

//route handling end

//exports
module.exports = router;

