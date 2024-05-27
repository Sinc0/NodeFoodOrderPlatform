//imports
const Restaurant = require('../models/restaurant')
const User = require('../models/user')
const Order = require('../models/order')
const Review = require('../models/review')
// const configs = require('../settings.json')
const stripe = require('stripe')(process.env.STRIPE_PAYMENTS_API_KEY || configs.STRIPE_PAYMENTS_API_KEY)


//functions
function parseLoginCookie(cookieId)
{
    //variables
    let findLoginCookie = cookieId
    let regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g
    //let regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g
    //let loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail)

    //match cookie
    let loginCookieId = findLoginCookie.match(regexFindLoginCookieId)

    //null check
    if(findLoginCookie == null || findLoginCookie == 'loginCookie=') { return null }
    if(regexFindLoginCookieId == null) { return null }
    
    //set cookieId
    cookieId = parseFloat(loginCookieId)

    //null check
    if(cookieId != null) { return cookieId }
    else { return null }
}


//gets
exports.getRestaurantDetail = async (req, res, next) => {
    //variables
    let restaurantUrl = req.params.restaurantUrl
    let validation = res.locals.validation
    
    //log
    process.stdout.write('restaurant > ' + restaurantUrl)

    //null check
    if(validation == undefined) { validationStatus = false }
    else { validationStatus = validation.status }

    //get restaurant data
    let restaurant = await Restaurant.findByUrl(restaurantUrl)

    //render page
    if(validationStatus == true) //logged in user
    {
        if(restaurant != null)
        {   
            res.render('user-restaurant-detail.ejs', {
                admin: validation.isAdmin,
                loggedIn: true,
                IsOpen: restaurant.open,
                restaurant: restaurant,
                restaurantImage: "",
                restaurantUrl: restaurantUrl,
                pageTitle: restaurant.title,
                path: '/restaurants'
            })
        }
        else
        {
            res.redirect('/')
        }
    }
    else //anonymous user
    {
        if(restaurant != null)
        {   
            res.render('user-restaurant-detail.ejs', {
                admin: false,
                loggedIn: false,
                IsOpen: restaurant.open,
                restaurant: restaurant,
                restaurantImage: "",
                restaurantUrl: restaurantUrl,
                pageTitle: restaurant.title,
                path: '/restaurants'
            })
        }
        else
        {
            res.redirect('/')
        }
    }
}


exports.getIndex = async (req, res, next) => {
    process.stdout.write('index')
    // process.stdout.write(req.ip)
    // process.stdout.write(req.connection.remoteAddress)
    // process.stdout.write(req.socket.remoteAddress)
    // process.stdout.write(req.headers['x-forwarded-for'])

    //variables
    let validation = res.locals.validation
    let restaurantUrl = res.locals.restaurantUrl

    //admin
    if(validation.status == true && validation.isAdmin == true) 
    {
        res.redirect("/admin/users")
    }
    
    //portal
    else if(validation.status == true && restaurantUrl != null)
    {
        res.redirect("/portal")
    }

    //user
    else if(validation.status == true) 
    {
        res.redirect("/restaurants")
    }

    //anon
    else 
    {
        res.render('user-index.ejs', { pageTitle: 'Food Ordering Platform', path: '/', admin: false, loggedIn: false })
    }
}


exports.getRestaurantList = async (req, res, next) => {
    //log
    process.stdout.write('restaurants')

    //variables
    let validation = res.locals.validation
    let validationStatus = null
    let restaurants = await Restaurant.fetchAll()
    let reviews = await Review.fetchAll()
    
    //null check
    if(validation == undefined) { validationStatus = false }
    else { validationStatus = validation.status }
    
    //render page
    if(validationStatus == true) //logged in user
    {
        res.render('user-restaurants.ejs', {
            admin: validation.isAdmin,
            loggedIn: true,
            restaurantImage: "",
            restaurants: restaurants,
            reviews: reviews,
            path: '/restaurants'
        })
    }
    else  //anon user
    {
        res.render('user-restaurants.ejs', {
            admin: false,
            loggedIn: false,
            restaurantImage: "",
            restaurants: restaurants,
            reviews: reviews,
            path: '/restaurants'
        })
    }       
}


exports.getOrders = (req, res, next) => {
    //log
    process.stdout.write('orders')

    //variables
    let validation = res.locals.validation
    let userEmail = res.locals.userEmail

    //logged in user
    if(validation.status == true) 
    {
        Order
            .FindByUser(userEmail).then(orders => {
            res.render('user-orders.ejs', {
                admin: validation.isAdmin,
                loggedIn: true,
                orders: orders,
                path: '/orders',
                pageTitle: 'Orders'
            })
        })
    }

    //anonymous user
    else 
    {
        res.render('user-index.ejs', { pageTitle: 'Home', path: '/', admin: false, loggedIn: false })
    }
}


exports.getCheckout = async (req, res, next) => {
    //log
    process.stdout.write('checkout')

    //variables
    let validation = res.locals.validation
    let email = res.locals.userEmail
    let cartItems = req.body.cartAllItems
    let customerComment = req.body.customerComment
    let cartTotalPrice = req.body.cartTotalPrice
    let restaurant = req.body.restaurant

    //get user data
    let user = await User.findByEmail(email)

    //creat payment obj
    const intent = await stripe.paymentIntents.create({
        amount: 100,
        currency: 'usd', 
        metadata: {integration_check: 'accept_a_payment'}
    })
    
    //render page
    if(validation.status == true && cartItems != null) //logged in user
    {
        res.render('user-checkout.ejs', 
        {
            path: '/checkout',
            pageTitle: 'Checkout',
            customerName: user.email,
            customerAddress: user.address,
            customerPhone: user.phone,
            customerComment: customerComment,
            cartItems: cartItems,
            cartItemsParsed: JSON.parse(cartItems),
            cartTotalPrice: cartTotalPrice,
            restaurant: restaurant,
            amount: intent.amount,
            currency: intent.currency,
            client_secret: intent.client_secret 
        })
    }
    else //anonymous user
    {
        res.redirect('/')
    }
}


exports.getLogout = (req, res, next) => {
    //log
    process.stdout.write('logout')

    //variables
    let validation = res.locals.validation
    
    //logged in user
    if(validation.status == true) 
    {
        res.render('user-logout.ejs', { admin: validation.isAdmin, loggedIn: true, pageTitle: 'Logout', path: '/logout', statusText: '' })
    }

    //anonymous user
    else 
    {
        res.redirect('/')
    }
}


exports.getProfile = async (req, res, next) => {
    //log
    process.stdout.write('account')

    //variables
    let validation = res.locals.validation
    let userEmail = res.locals.userEmail
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let update = req.query.update

    //get user data
    let user = await User.findByCookieIdReturnUserObject(cookieId)

    //logged in user
    if(validation.status == true)
    {
        res.render('user-profile.ejs', { 
            admin: validation.isAdmin,
            loggedIn: true,
            pageTitle: 'Profile',
            path: '/profile',
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            update: update,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || configs.GOOGLE_MAPS_API_KEY
        })
    }

    //anon user
    else
    {
        res.render('user-index.ejs', { pageTitle: 'Home', path: '/', admin: false, loggedIn: false })
    }
}


exports.getRegister = (req, res, next) => {
    //log
    process.stdout.write("\n" + "anon > register")

    //render page
    res.render('user-register.ejs', { pageTitle: 'Register', path: '/register', statusText: '' })
}


exports.getLogin = (req, res, next) => {
    //log
    process.stdout.write("\n" + "anon > login")

    //render page
    res.render('user-login.ejs', { pageTitle: 'Login', path: '/login', statusText: '' })
}


exports.getStripe = async (req, res, next) => {
    //log
    process.stdout.write('stripe')

    //create payment obj
    let intent = await stripe.paymentIntents.create({
            amount: 100,
            currency: 'usd',
            metadata: {integration_check: 'accept_a_payment'}
        }
    )
    
    //render page
    res.render('shop/stripe', { amount: intent.amount, currency: intent.currency, client_secret: intent.client_secret })
}


exports.getOrderProcess = async (req, res, next) => {
    //log
    process.stdout.write('order-process')
    
    //variables
    let orderId = req.params.orderId
    let order = await Order.findById(orderId)

    //null check
    if(order != null && order.status == "unconfirmed") 
    { 
        res.render('user-order-process.ejs', { order: order }) 
    }
    else
    {
        res.redirect('/')
    }
}


exports.getAbout = (req, res, next) => {
    //log
    process.stdout.write("\n" + "anon > about")

    //render page
    res.render('user-about.ejs', {})
}


//posts
exports.postOrder = async (req, res, next) => {
    //log
    process.stdout.write('post-order > ')

    //variables
    let validation = res.locals.validation
    let userEmail = res.locals.userEmail
    let cartItems = req.body.cartAllItems
    let totalPrice = req.body.cartTotalPrice
    let restaurant = req.body.restaurant
    let customerName = req.body.customerName
    let customerPhone = req.body.customerPhone
    let customerAddress = req.body.customerAddress
    let customerDelivery = req.body.customerDelivery
    let customerComment = req.body.customerComment
    let orderProducts = JSON.parse(cartItems)

    
    if(validation.status == true) //logged in user
    {
         let r = await Restaurant.findByUrl(restaurant)
         let restaurantTitle  = r.title
         let orderId = null
         
         //create order
         let createOrder = await Order
                                     .createOrder(
                                            userEmail, 
                                            orderProducts, 
                                            totalPrice, 
                                            customerComment, 
                                            restaurant, 
                                            customerName, 
                                            customerPhone, 
                                            customerAddress, 
                                            customerDelivery, 
                                            restaurantTitle
                                        )
         
         //set orderId
         orderId = createOrder.ops[0]._id

         //create order successful
         if(createOrder.insertedCount != null)
         {
            //log
            process.stdout.write('create order: successful')

            //render page
            res.redirect("/order-process/" + orderId)
         }

         //create order failed
         else
         {
            //log
            process.stdout.write('create order: failed')

            //render page
            res.redirect('/')
         }
     }
     else //anonymous user
     {
         res.redirect('/')
     }
}


exports.postLogout = (req, res, next) => {
    //log 
    process.stdout.write('post-logout > ')

    //variables
    let logoutSuccessful = 1
    let logoutFailed = 0
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let validation = res.locals.validation

    //set header
    res.setHeader('Set-Cookie', 'loginCookie="";expires=Thu, 01 Jan 1970 00:00:01 GMT;')
    
    if(validation.status == true) //logged in user
    {
        User
            .logout(loginCookie)
            .then(result => {
                if(result == logoutSuccessful) 
                { 
                    //render page
                    res.redirect('/') 
                }
                else
                {
                    //log
                    process.stdout.write('logout failed')

                    //render page
                    res.render('user-logout.ejs', { pageTitle: 'Logout', path: '/logout', statusText: 'logout failed, try again in a few minutes'
                    })
                }
            })
    }
    else
    {
        res.redirect('/')
    }
}


exports.postRegister = (req, res, next) => {
    //log
    process.stdout.write('post-register > ')
    
    //variables
    let username = req.body.nameCustomer
    let email = req.body.emailCustomer
    let password = req.body.passwordCustomer

    //register user
    User
        .register(email, username, password)
        .then(result => {
            if(result == 'registration successful')
            {
                process.stdout.write('result: ' + result + ' ')
                res.render('user-login.ejs', { pageTitle: 'Login', path: '/login', statusText: 'registration successful, login below' })
            }
            else if(result == 'username is taken')
            {
                process.stdout.write('result: ' + result + ' ')
                res.render('user-register.ejs', { pageTitle: 'Register', path: '/register', statusText: result })
            }
            else if(result == 'email is taken')
            {
                process.stdout.write('result: ' + result + ' ')
                res.render('user-register.ejs', { pageTitle: 'Register', path: '/register', statusText: result })
            }
            else
            {
                process.stdout.write('result: ' + 'database error')
                res.render('user-register.ejs', { 
                    pageTitle: 'Register', 
                    path: '/register', 
                    statusText: 'database error, try again in a few minutes' 
                })
            }
    })
}


exports.postRegisterRestaurant = async (req, res, next) => {
    //log
    process.stdout.write('post-register-restaurant > ')

    //variables
    let email = req.body.emailRestaurant
    let address = req.body.addressRestaurant
    let phone = req.body.phoneRestaurant
    let owner = req.body.ownerRestaurant
    let city = req.body.city
    let restaurantName = req.body.nameRestaurant
    let companyIdNumber = req.body.companyIdNumberRestaurant
    let password = req.body.passwordRestaurant
    
    //register restaurant
    let registerRestaurant = await User
                                      .registerRestaurant(
                                            email, 
                                            address, 
                                            phone, 
                                            owner, 
                                            restaurantName, 
                                            companyIdNumber, 
                                            password, 
                                            city
                                        )
                                        
    //set result
    let result = registerRestaurant

    //register successful
    if(result == 'registration successful')
    {
        res.render('user-login.ejs', { pageTitle: 'Login', path: '/login', statusText: 'registration successful' })
    }

    //register error 1
    else if(result == 'email is taken')
    {
        res.render('user-register.ejs', { pageTitle: 'Register', path: '/register', statusText: 'email is taken, try again with another email' })
    }

    //register error 2
    else
    {
        res.render('user-register.ejs', { pageTitle: 'Register', path: '/register', statusText: 'database error, try again in a few minutes' })   
    }
}


exports.postLogin = async (req, res, next) => {
    //log
    process.stdout.write('post-login > ')

    //variables
    let email = req.body.email
    let password = req.body.password
    
    User
        .login(email, password)
        .then(result => {
                    if(result.statusText == 'login successful')
                    {
                        process.stdout.write('login user: ' + result.email + ' successful')
                        Restaurant
                                .findByEmail(result.email)
                                .then(restaurantCheck => {
                                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';path=/')
                                    
                                    if(result.email == "admin@mail.com") { res.redirect('/admin/users') }
                                    else if(restaurantCheck != null) { res.redirect('/portal') }
                                    else if(restaurantCheck == null) { res.redirect('/restaurants') }
                                })   
                    }
                    else if(result == 'email is invalid')
                    {
                        process.stdout.write('login user: email is invalid')
                        res.render('user-login.ejs', { pageTitle: 'Login', path: '/login', statusText: result })
                    }
                    else if(result == 'invalid password')
                    {
                        process.stdout.write('login user: invalid password')
                        res.render('user-login.ejs', { pageTitle: 'Login', path: '/login', statusText: result })
                    }
                    else if(result == 'database error, try again in a few minutes')
                    {
                        process.stdout.write('login user: database error')
                        res.render('user-login.ejs', { 
                            pageTitle: 'Login',
                            path: '/login',
                            statusText: result
                        })
                    }
    })
}


exports.postWebhook = (req, res, next) => {
    //log
    process.stdout.write('post-payment-webhook')

    //variables
    let event = req.body

    //check payment intent
    if(event.type == 'payment_intent.succeeded') 
    {
        let paymentIntent = event.data.object
        process.stdout.write('PaymentIntent was successful!')
        res.json({received: true})
    }
    else if(event.type == 'payment_method.attached')
    {
        let paymentMethod = event.data.object
        process.stdout.write('PaymentMethod was attached to a Customer!')
        res.json({received: true})
    }
    else
    {
        return res.status(400).end()   
    }
}


exports.postUserUpdateCredentials = async (req, res, next) => {
    //log
    process.stdout.write('post-update-credentials')
    
    //variables
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let email = req.body.email
    let name = req.body.name
    let phone = req.body.phone
    let address = req.body.address
    
    //update user
    let updateUser = await User.updateCredentials(email, name, address, phone)

    //render page
    res.redirect('/account')
}


exports.postUserUpdatePassword = async (req, res, next) => {
    //log
    process.stdout.write('post-update-password')

    //variables
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let email = req.body.email
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword

    //get user data
    let user = await User.findByEmail(email)
    
    //check old password
    if(user.password == oldPassword)
    {
        //update password
        await User.updatePassword(email, newPassword)

        //render apge
        res.redirect('/account?update=successful')
    }
    else
    {
        //render page
        res.redirect('/account?update=oldpasswordincorrect')
    }
}


exports.postRestaurantReview = async (req, res, next) => {
    //log
    process.stdout.write('post-restaurant-review')

    //variables
    let orderId = req.body.orderId
    let restaurant = req.body.restaurant
    let user = res.locals.userEmail
    let date = new Date()
    let name = req.body.customerName
    let rating = req.body.rating
    let items = req.body.items
    let comment = req.body.comment
    let reviewObject = {date: date, name: name, rating: rating, items: null, comment: comment}

    //get review data
    let checkIfOrderReviewExist = await Review.findByOrderId(orderId)

    //review does not exists
    if(checkIfOrderReviewExist == null)
    {
        await Review.create(user, restaurant, reviewObject, orderId)
        await Order.updateWithReview(orderId, reviewObject)
    }

    //review exists
    else if(checkIfOrderReviewExist != null)
    {
        await Review.update(user, restaurant, reviewObject, orderId)
        await Order.updateWithReview(orderId, reviewObject)
    }

    //render page
    res.redirect("/orders")
}