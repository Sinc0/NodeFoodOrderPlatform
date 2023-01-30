//imports
const express = require('express')
const router = express.Router()
const adminValidation = require('./validationUser.js')
const restaurantValidation = require('./validationRestaurant.js')
const userValidation = require('./validationUser.js')
const restaurantPortalController = require('./controllers/restaurantPortal')
const adminController = require('./controllers/admin')
const shopController = require('./controllers/user')

//admin
router.get('/admin/home', adminValidation, adminController.getHome)
router.get('/admin/orders', adminValidation, adminController.getOrders)
router.get('/admin/restaurants', adminValidation, adminController.getRestaurants)
router.get('/admin/users', adminValidation, adminController.getUsers)
router.get('/admin/reviews', adminValidation, adminController.getReviews)
router.get('/admin/stats', adminValidation, adminController.getStats)
router.post('/admin/edit-order', adminValidation, adminController.postEditOrder)
router.post('/admin/edit-restaurant', adminValidation, adminController.postEditRestaurant)
router.post('/admin/edit-user', adminValidation, adminController.postEditUser)
router.post('/admin/edit-review', adminValidation, adminController.postEditReview)
router.post('/admin/edit-newsPost', adminValidation, adminController.postEditNewsPost)
router.post('/admin/delete-order', adminValidation, adminController.postDeleteOrder)
router.post('/admin/delete-restaurant', adminValidation, adminController.postDeleteRestaurant)
router.post('/admin/delete-user', adminValidation, adminController.postDeleteUser)
router.post('/admin/delete-review', adminValidation, adminController.postDeleteReview)
router.post('/admin/delete-newsPost', adminValidation, adminController.postDeleteNewsPost)
router.post('/admin/post-newsPost', adminValidation, adminController.postNewsPost)

//restaurant
router.get('/restaurantPortal', restaurantValidation, restaurantPortalController.getRestaurantIndex)
router.get('/restaurantPortal/orders/accept', restaurantValidation, restaurantPortalController.getRestaurantOrdersAccept)
router.get('/restaurantPortal/orders/history', restaurantValidation, restaurantPortalController.getRestaurantOrdersHistory)
router.get('/restaurantPortal/orders/cook', restaurantValidation, restaurantPortalController.getRestaurantOrdersChef)
router.get('/restaurantPortal/menu/edit', restaurantValidation, restaurantPortalController.getRestaurantMenuEdit)
router.get('/restaurantPortal/stats', restaurantValidation, restaurantPortalController.getRestaurantStats)
router.get('/restaurantPortal/reviews', restaurantValidation, restaurantPortalController.getRestaurantReviews)
router.get('/restaurantPortal/settings', restaurantValidation, restaurantPortalController.getRestaurantSettings)
router.get('/restaurantPortal/logout', restaurantValidation, restaurantPortalController.getRestaurantLogout)
router.post('/restaurantPortal/order-update', restaurantValidation, restaurantPortalController.postOrderUpdate)
router.post('/restaurantPortal/updateMenu', restaurantValidation, restaurantPortalController.postRestaurantUpdateMenu)
router.post('/restaurantPortal/menuListed', restaurantValidation, restaurantPortalController.postRestaurantMenuListed)
router.post('/restaurantPortal/menuOnline', restaurantValidation, restaurantPortalController.postRestaurantMenuOnline)
router.post('/restaurantPortal/welcomeMessage', restaurantValidation, restaurantPortalController.postRestaurantWelcomeMessage)
// router.get('/restaurantPortal/orders/completed', restaurantValidation, restaurantPortalController.getRestaurantOrdersCompleted)
// router.get('/restaurantPortal/menu/show', restaurantValidation, restaurantPortalController.getRestaurantMenuShow)

//user
router.get('/', userValidation, shopController.getIndex)
router.get('/login', shopController.getLogin)
router.get('/about', shopController.getAbout)
router.get('/register', shopController.getRegister)
router.get('/restaurants', userValidation, shopController.getRestaurantList)
router.get('/restaurant/:restaurantUrl', userValidation, shopController.getRestaurantDetail)
router.get('/account', userValidation, shopController.getProfile)
router.get('/orders', userValidation, shopController.getOrders)
router.get('/logout', userValidation, shopController.getLogout)
router.post('/register-post', shopController.postRegister)
router.post('/register-restaurant-post', shopController.postRegisterRestaurant)
router.post('/login-post', shopController.postLogin)
router.post('/user-update-credentials', userValidation, shopController.postUserUpdateCredentials)
router.post('/user-update-password', userValidation, shopController.postUserUpdatePassword)
router.post('/order-post', userValidation, shopController.postOrder)
router.post('/logout-post', userValidation, shopController.postLogout)
router.post('/webhook', userValidation, shopController.postWebhook)
router.post('/review-post', userValidation, shopController.postRestaurantReview)
router.all('/order-process/:orderId', userValidation, shopController.getOrderProcess)
router.all('/checkout', userValidation, shopController.getCheckout)
// router.get('/order-details/:orderId', userValidation, shopController.getOrderDetails)

//tests
//router.get('/googleMapsApiTest', validation, shopController.getGoogleMapsApiTest)
//router.get('/stripe', validation, shopController.getStripe)
//router.get('/paypalTest', shopController.getTest)
// router.post('/paypalCreateOrder', userValidation, shopController.getPayPalCreateOrder)
// router.get('/paypalSuccess', userValidation, shopController.getPayPalSuccess)
// router.get('/paypalCancel', userValidation, shopController.getPayPalCancel)

//exports
module.exports = router