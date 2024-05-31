### Summary
- Name: Food Order Platform
- Description: Order / Sell Restaurant Food
- LoC: ~8200
- [Logo](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/public/pwa/pwa-icon-512x512.png)
###
- Features:
- \--- **General**
- \--- Browse Restaurants
- \--- Register User/Restaurant Account
- \--- 3 Portals (User, Restaurant, Admin)
- \--- PWA Support
###
- \--- **User Portal** 
- \--- Browse Restaurants
- \--- Place Order
- \--- Pay Order (Stripe Payments API)
- \--- Review Order
- \--- See Order History
- \--- See Order Status (Unconfirmed, Confirmed, Declined, Completed)
- \--- Show/Edit Account Contact Details
- \--- See Address Suggestions (Google Maps API)
###
- \--- **Restaurant Portal**
- \--- Accept/Decline/Complete Orders
- \--- Edit Restaurant Menu/Details
- \--- Sale Statistics
- \--- Customer Reviews
- \--- Open/Close Restaurant
- \--- Activate/Deactivate Restaurant
- \--- See Driving Distance to Customer (Google Maps API)
###
- \--- **Admin Portal** 
- \--- See User Statistics
- \--- Edit: Users, Restaurants, Reviews
- \--- Delete: Users, Restaurants, Reviews
- \--- See Address Suggestions (Google Maps API)

### Technologies
- [NodeJS](https://www.nodejs.org)
- [ExpressJS](https://expressjs.com)
- [EJS](https://ejs.co)
- [MongoDB](https://www.mongodb.com)
- [Websockets](https://websocket.org)

### 3rd Party APIs
- [Google Maps](https://developers.google.com/maps)
- [Stripe Payments](https://stripe.com/payments)

### Code
- [File - Server](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/server.js)
- [File - Routes](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/routes.js)
- [File - Validation](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/validation.js)
- [File - Database](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/database.js)
###
- [Directory - Models](https://github.com/Sinc0/NodeFoodOrderingPlatform/tree/master/models)
- [Directory - Controllers](https://github.com/Sinc0/NodeFoodOrderingPlatform/tree/master/controllers)
- [Directory - Views](https://github.com/Sinc0/NodeFoodOrderingPlatform/tree/master/views)
###
- [General Set Background Gif](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/views/user-index.ejs#L19-L31)
###
- [Register - User](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/user.js#L486-L524)
- [Register - Restaurant](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/user.js#L527-L574)