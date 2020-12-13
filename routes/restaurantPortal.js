//imports
const express = require('express');
const restaurantPortalController = require('../controllers/restaurantPortal');
const router = express.Router();
const restaurantValidation = require('../validation/restaurantValidation');



//get
router.get('/restaurantPortal', restaurantValidation, restaurantPortalController.getRestaurantIndex);
router.get('/restaurantPortal/orders/accept', restaurantValidation, restaurantPortalController.getRestaurantOrdersAccept);
router.get('/restaurantPortal/orders/completed', restaurantValidation, restaurantPortalController.getRestaurantOrdersCompleted);
router.get('/restaurantPortal/orders/declined', restaurantValidation, restaurantPortalController.getRestaurantOrdersDeclined);
router.get('/restaurantPortal/orders/chef', restaurantValidation, restaurantPortalController.getRestaurantOrdersChef);
router.get('/restaurantPortal/menu/show', restaurantValidation, restaurantPortalController.getRestaurantMenuShow);
router.get('/restaurantPortal/menu/edit', restaurantValidation, restaurantPortalController.getRestaurantMenuEdit);
router.get('/restaurantPortal/stats', restaurantValidation, restaurantPortalController.getRestaurantStats);
router.get('/restaurantPortal/reviews', restaurantValidation, restaurantPortalController.getRestaurantReviews);
router.get('/restaurantPortal/settings', restaurantValidation, restaurantPortalController.getRestaurantSettings);
router.get('/restaurantPortal/logout', restaurantValidation, restaurantPortalController.getRestaurantLogout);

//post
router.post('/restaurantPortal/order-update', restaurantValidation, restaurantPortalController.postOrderUpdate);
router.post('/restaurantPortal/updateMenu', restaurantValidation, restaurantPortalController.postRestaurantUpdateMenu);
router.post('/restaurantPortal/menuListed', restaurantValidation, restaurantPortalController.postRestaurantMenuListed);
router.post('/restaurantPortal/menuOnline', restaurantValidation, restaurantPortalController.postRestaurantMenuOnline);
router.post('/restaurantPortal/welcomeMessage', restaurantValidation, restaurantPortalController.postRestaurantWelcomeMessage);

//exports
module.exports = router;