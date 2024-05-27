### Summary
- Name: Food Order Platform
- Description: Order / Sell Restaurant Food
- LoC: ~8200
- [Logo](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/public/icon.png)
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
- [ExpressJS]()
- [EJS]()
- [MongoDB]()
- [Websockets]()

### 3rd Party APIs
- [Google Maps](https://developers.google.com/maps)
- [Stripe Payments](https://stripe.com/payments)

### Code
- [File - Routes](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/routes.js)
- [File - Validation](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/validation.js)
###
- [Order - Accept](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/portal.js#L283-L297)
- [Order - Pay](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/user.js#L624-L648)
###
- [Cart](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/views/user-restaurant-detail.ejs#L32-L301)
- [Register User](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/user.js#L486-L524)
- [Register Restaurant](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/controllers/user.js#L527-L574)
- [Set Background Gif](https://github.com/Sinc0/NodeFoodOrderingPlatform/blob/master/views/user-index.ejs#L19-L31)