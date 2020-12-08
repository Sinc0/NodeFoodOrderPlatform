//imports
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const adminValidation = require('../validation/userValidation');



//get
router.get('/admin/home', adminValidation, adminController.getHome);
router.get('/admin/orders', adminValidation, adminController.getOrders);
router.get('/admin/restaurants', adminValidation, adminController.getRestaurants);
router.get('/admin/users', adminValidation, adminController.getUsers);
router.get('/admin/reviews', adminValidation, adminController.getReviews);
router.get('/admin/stats', adminValidation, adminController.getStats);

//edit
router.post('/admin/edit-order', adminValidation, adminController.postEditOrder);
router.post('/admin/edit-restaurant', adminValidation, adminController.postEditRestaurant);
router.post('/admin/edit-user', adminValidation, adminController.postEditUser);
router.post('/admin/edit-review', adminValidation, adminController.postEditReview);
router.post('/admin/edit-newsPost', adminValidation, adminController.postEditNewsPost);

//delete
router.post('/admin/delete-order', adminValidation, adminController.postDeleteOrder);
router.post('/admin/delete-restaurant', adminValidation, adminController.postDeleteRestaurant);
router.post('/admin/delete-user', adminValidation, adminController.postDeleteUser);
router.post('/admin/delete-review', adminValidation, adminController.postDeleteReview);
router.post('/admin/delete-newsPost', adminValidation, adminController.postDeleteNewsPost);

//other
router.post('/admin/post-newsPost', adminValidation, adminController.postNewsPost);

//exports
module.exports = router;

