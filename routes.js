//imports
const express = require('express')
const router = express.Router()
const admin = require('./controllers/admin')
const restaurant = require('./controllers/portal')
const user = require('./controllers/user')
const validation = require('./validation.js')


//admin
router.get('/admin', validation, admin.getStats)
router.get('/admin/restaurants', validation, admin.getRestaurants)
router.get('/admin/users', validation, admin.getUsers)
router.get('/admin/stats', validation, admin.getStats)
router.get('/admin/reviews', validation, admin.getReviews)
router.post('/admin/edit-restaurant', validation, admin.postEditRestaurant)
router.post('/admin/edit-user', validation, admin.postEditUser)
router.post('/admin/delete-restaurant', validation, admin.postDeleteRestaurant)
router.post('/admin/delete-review', validation, admin.postDeleteReview)
router.post('/admin/edit-review', validation, admin.postEditReview)
router.post('/admin/delete-user', validation, admin.postDeleteUser)


//restaurant portal
router.get('/portal', validation, restaurant.getRestaurantIndex)
router.get('/portal/orders/accept', validation, restaurant.getRestaurantOrdersAccept)
router.get('/portal/orders/history', validation, restaurant.getRestaurantOrdersHistory)
router.get('/portal/orders/cook', validation, restaurant.getRestaurantOrdersChef)
router.get('/portal/menu/edit', validation, restaurant.getRestaurantMenuEdit)
router.get('/portal/stats', validation, restaurant.getRestaurantStats)
router.get('/portal/reviews', validation, restaurant.getRestaurantReviews)
router.get('/portal/settings', validation, restaurant.getRestaurantSettings)
router.get('/portal/logout', validation, restaurant.getRestaurantLogout)
router.post('/portal/order-update', validation, restaurant.postOrderUpdate)
router.post('/portal/updateMenu', validation, restaurant.postRestaurantUpdateMenu)
router.post('/portal/menuListed', validation, restaurant.postRestaurantMenuListed)
router.post('/portal/menuOnline', validation, restaurant.postRestaurantMenuOnline)
router.post('/portal/welcomeMessage', validation, restaurant.postRestaurantWelcomeMessage)


//user portal
router.get('/login', user.getLogin)
router.get('/about', user.getAbout)
router.get('/privacy', user.getAbout)
router.get('/register', user.getRegister)
router.get('/', validation, user.getIndex)
router.get('/restaurants', validation, user.getRestaurantList)
router.get('/restaurant/:restaurantUrl', validation, user.getRestaurantDetail)
router.get('/account', validation, user.getProfile)
router.get('/orders', validation, user.getOrders)
router.get('/logout', validation, user.getLogout)
router.post('/register-post', user.postRegister)
router.post('/register-restaurant-post', user.postRegisterRestaurant)
router.post('/login-post', user.postLogin)
router.post('/user-update-credentials', validation, user.postUserUpdateCredentials)
router.post('/user-update-password', validation, user.postUserUpdatePassword)
router.post('/order-post', validation, user.postOrder)
router.post('/logout-post', validation, user.postLogout)
router.post('/webhook', validation, user.postWebhook)
router.post('/review-post', validation, user.postRestaurantReview)
router.all('/order-process/:orderId', validation, user.getOrderProcess)
router.all('/checkout', validation, user.getCheckout)


//exports
module.exports = router