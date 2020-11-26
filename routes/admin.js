//imports
const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const validation = require('../validation/userValidation');

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

//other
router.post('/admin/post-newsPost', validation, adminController.postNewsPost);

//exports
module.exports = router;

