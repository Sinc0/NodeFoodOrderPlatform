//variables
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Order = require('../models/order');
const Review = require('../models/review');
const Admin = require('../models/admin');
const stripe = require('stripe')('sk_test_51HEENaLFUjzCbJftCmqLgpLjLGgjY1OOI81cAAzEBmozVIetOISREohGCuuJq55KX3FGhFHvx9FENcU2zRdrIGmn00wIaynLwu');
// const paypal = require('@paypal/checkout-server-sdk');

//functions
function parseLoginCookie(cookieId)
{
    let findLoginCookie = cookieId;
    let regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g;
    let loginCookieId = findLoginCookie.match(regexFindLoginCookieId);
    //let regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g;
    //let loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail);
    
    cookieId = parseFloat(loginCookieId);

    if(findLoginCookie == null || findLoginCookie == 'loginCookie=') { return null }
    if(regexFindLoginCookieId == null) { return null }

    if(cookieId != null) { return cookieId }
    else { return null }
}

//get
exports.getRestaurantDetail = async (req, res, next) => {
    //variables
    let restaurantUrl = req.params.restaurantUrl
    let validation = res.locals.validation

    //log
    process.stdout.write('restaurant > ' + restaurantUrl)
    
    if(validation == undefined) { validationStatus = false }
    else { validationStatus = validation.status }

    let restaurant = await Restaurant.findByUrl(restaurantUrl);

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
            res.redirect('/');
        }
    }
}

exports.getIndex = async (req, res, next) => {
    process.stdout.write('index')
    // console.log(req.ip)
    // console.log(req.connection.remoteAddress)
    // console.log(req.socket.remoteAddress)
    // console.log(req.headers['x-forwarded-for'])

    let validation = res.locals.validation
    let email = res.locals.userEmail

    if(validation.status == true && validation.isAdmin == true) //user is admin
    {
        res.render('user-index.ejs', { 
            pageTitle: 'Home',
            path: '/',
            admin: validation.isAdmin,
            loggedIn: true,
        })
    }
    else if(validation.status == true) //logged in user
    {
        // let adminPosts = await Admin.fetchAllPosts()

        res.render('user-index.ejs', { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: true,
            adminPosts: null
        })
    }
    else //anonymous user
    {
        res.render('user-index.ejs', { 
            pageTitle: 'Food Ordering Platform',
            path: '/',
            admin: false,
            loggedIn: false,
        })
    }
}

exports.getRestaurantList = async (req, res, next) => {
    process.stdout.write('restaurants')

    let validation = res.locals.validation
    let validationStatus = null
    let restaurants = await Restaurant.fetchAll()
    let reviews = await Review.fetchAll()
    
    if(validation == undefined) { validationStatus = false }
    else { validationStatus = validation.status }
    
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
    process.stdout.write('orders')

    let validation = res.locals.validation
    let userEmail = res.locals.userEmail

    if(validation.status == true) //logged in user
    {
        Order.FindByUser(userEmail).then(orders => {
            res.render('user-orders.ejs', {
                admin: validation.isAdmin,
                loggedIn: true,
                orders: orders,
                path: '/orders',
                pageTitle: 'Orders'
            })
        })
    }
    else //anonymous user
    {
        res.render('user-index.ejs', { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: false,
        })
    }
}

exports.getCheckout = async (req, res, next) => {
    process.stdout.write('checkout')

    let validation = res.locals.validation
    let email = res.locals.userEmail
    let cartItems = req.body.cartAllItems;
    let customerComment = req.body.customerComment;
    let cartTotalPrice = req.body.cartTotalPrice;
    let restaurant = req.body.restaurant;

    let user = await User.findByEmail(email)

    const intent = await stripe.paymentIntents.create({
        amount: 100, //cartTotalPrice 
        currency: 'usd', 
        metadata: {integration_check: 'accept_a_payment'} // Verify your integration in this guide by including this parameter
    })
    
    
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
    process.stdout.write('logout')

    let validation = res.locals.validation
    
    if(validation.status == true) //logged in user
    {
        res.render('user-logout.ejs', {
            admin: validation.isAdmin,
            loggedIn: true,
            pageTitle: 'Logout',
            path: '/logout',
            statusText: ''
        })
    }
    else //anonymous user
    {
        res.redirect('/');
    }
}

exports.getProfile = async (req, res, next) => {
    process.stdout.write('account')
    
    let validation = res.locals.validation
    let userEmail = res.locals.userEmail
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let update = req.query.update

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
            update: update
        })
    }

    //anon user
    else
    {
        res.render('user-index.ejs', { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: false,
        })
    }
}

exports.getRegister = (req, res, next) => {
    process.stdout.write("\n" + "anon > register")

    res.render('user-register.ejs', {
        pageTitle: 'Register',
        path: '/register',
        statusText: ''
    })
}

exports.getLogin = (req, res, next) => {
    process.stdout.write("\n" + "anon > login")

    res.render('user-login.ejs', {
        pageTitle: 'Login',
        path: '/login',
        statusText: ''
    })
}

exports.getStripe = async (req, res, next) => {
    process.stdout.write('stripe')

    let intent = await stripe.paymentIntents.create({
        amount: 100,
        currency: 'usd',
        metadata: {integration_check: 'accept_a_payment'}  // Verify your integration in this guide by including this parameter
    })
    
    res.render('shop/stripe', { 
        amount: intent.amount,
        currency: intent.currency,
        client_secret: intent.client_secret 
    })
}

// exports.getOrderDetails = async (req, res, next) => {
//     process.stdout.write('order-details')

//     let validation = res.locals.validation
//     let userEmail = res.locals.userEmail
//     let orderId = req.params.orderId

//     let order = await Order.findById(orderId)

//     if(order != null)
//     {
//         if(validation.status == true)
//         {
//             res.render('user-order-details.ejs', { 
//                 admin: validation.isAdmin,
//                 pageTitle: 'Order Details',
//                 path: '/order-details',
//                 loggedIn: true,
//                 order: order
//             })
//         }
//         else
//         {
//             res.redirect('/')
//         }
//     }
//     else
//     {
//         res.redirect('/')
//     }
// }

exports.getOrderProcess = async (req, res, next) => {
    process.stdout.write('order-process')
    
    let orderId = req.params.orderId
    let order = await Order.findById(orderId)

    if(order != null && order.status == "unconfirmed")
    {
        res.render('user-order-process.ejs', { 
            order: order
        })
    }
    else
    {
        res.redirect('/')
    }
}

exports.getAbout = (req, res, next) => {
    process.stdout.write("\n" + "anon > about")

    res.render('user-about.ejs', {})
}

// exports.getContact = (req, res, next) => {
//     process.stdout.write('contact')

//     res.render('user-contact.ejs', {})
// }

// exports.getTest = async (req, res, next) => {
//     process.stdout.write('getTest')

//     res.render('test/test.ejs', { })
// }

// exports.getGoogleMapsApiTest = async (req, res, next) => {
//     process.stdout.write('getTest')
//     console.log(req.body)
//     console.log(res.locals.userEmail)

//     res.render('test/googleMapsApi.ejs', 
//     { 

//     })
// }

// exports.getPayPalCreateOrder = async (req, res, next) => {
//     console.log("getPayPalCreateOrder")
//     console.log(req.body)

//     let amount = "temp"

//     //Creating an environment
//     let clientId = "AVm4xAcY_8YjJjr-nN4_YYUrEx5N8K_-gvJP0jtZbFc_aqApF6pmZGs4i4xzbUNp77tsC3NT5zHmtBiP"
//     let clientSecret = "EKV9wYIfLMjnapE4Erg-9Z7AUE-yWmcj2TzcWmbthC8U8_BlyihIFKnMwAX-Ouu46R9nUwYjS2jHw0oz"

//     //This sample uses SandboxEnvironment. In production, use LiveEnvironment
//     let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
//     let client = new paypal.core.PayPalHttpClient(environment)

//     //Construct a request object and set desired parameters
//     //Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
//     let request = new paypal.orders.OrdersCreateRequest()

//     request.requestBody(
//         {
//             "intent": "CAPTURE",
//             "application_context": {
//                 "return_url": "http://localhost:3000/paypalSuccess",
//                 "cancel_url": "http://localhost:3000/paypalCancel"
//             },
//             "purchase_units": [
//                 {
//                     "amount": {
//                         "currency_code": "USD",
//                         "value": "1.00"
//                     }
//                 }
//             ]
//         }
//     )

//     //Call API with your client and get a response for your call
//     let createOrder = async function()
//     {
//         let response = await client.execute(request)

//         console.log(`Response: ${JSON.stringify(response)}`)
        
//         //If call returns body in response, you can get the deserialized version from the result attribute of the response.
//         console.log(`Order: ${JSON.stringify(response.result)}`)

//         let orderId = response.result.id
//         let status = response.result.status
//         let httpAdress = response.result.links[1].href

//         console.log(response.result.id)
//         console.log(response.result.status)
//         console.log(response.result.links[1].href)

//         if(status === "CREATED") { res.redirect(httpAdress) }
//         else { res.redirect('/temp') }
//     }

//     //Start
//     createOrder()
// }

// exports.getPayPalSuccess = async (req, res, next) => {
//     console.log("getPayPalSuccess")
//     console.log(req.query)

//     let payerID = req.query.PayerID
//     let token = req.query.token
//     let approvedOrderId = token

//     console.log(payerID)
//     console.log(token)

//     //Creating an environment
//     let clientId = "AVm4xAcY_8YjJjr-nN4_YYUrEx5N8K_-gvJP0jtZbFc_aqApF6pmZGs4i4xzbUNp77tsC3NT5zHmtBiP"
//     let clientSecret = "EKV9wYIfLMjnapE4Erg-9Z7AUE-yWmcj2TzcWmbthC8U8_BlyihIFKnMwAX-Ouu46R9nUwYjS2jHw0oz"

//     //This sample uses SandboxEnvironment. In production, use LiveEnvironment
//     let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
//     let client = new paypal.core.PayPalHttpClient(environment)

//     let processOrder = async function(orderId) 
//     {
//         request = new paypal.orders.OrdersCaptureRequest(orderId)
//         request.requestBody({})

//         // Call API with your client and get a response for your call
//         let response = await client.execute(request)
//         console.log(`Response: ${JSON.stringify(response)}`)

//         // If call returns body in response, you can get the deserialized version from the result attribute of the response.
//         console.log(`Capture: ${JSON.stringify(response.result)}`)
        
        
//         if(response.result.status === "COMPLETED") { res.redirect('/temp') } // If payment successful
//         else { res.redirect('/temp') } // If payment error
//     }

//     let process = processOrder(token)
// }

// exports.getPayPalCancel = async (req, res, next) => {
//     console.log("getPayPalCancel")

//     res.redirect('/')
// }

//post
exports.postOrder = async (req, res, next) => {
    process.stdout.write('post-order > ')

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
         let createOrder = await Order.createOrder(userEmail, orderProducts, totalPrice, customerComment, restaurant, customerName, customerPhone, customerAddress, customerDelivery, restaurantTitle)
         let orderId = createOrder.ops[0]._id;

         if(createOrder.insertedCount != null)
         {
            process.stdout.write('create order: successful')
            res.redirect("/order-process/" + orderId)
         }
         else
         {
            process.stdout.write('create order: failed')
             res.redirect('/')
         }
     }
     else //anonymous user
     {
         res.redirect('/')
     }
}

exports.postLogout = (req, res, next) => {  
    process.stdout.write('post-logout > ')

    let logoutSuccessful = 1
    let logoutFailed = 0
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let validation = res.locals.validation

    res.setHeader('Set-Cookie', 'loginCookie="";expires=Thu, 01 Jan 1970 00:00:01 GMT;')
    
    if(validation.status == true) //logged in user
    {
        User.logout(loginCookie).then(result => {
            if(result == logoutSuccessful)
            {
                res.redirect('/');
            }
            else
            {
                process.stdout.write('logout failed')
                res.render('user-logout.ejs', { 
                    pageTitle: 'Logout',
                    path: '/logout',
                    statusText: 'logout failed, try again in a few minutes'
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
    process.stdout.write('post-register > ')
    
    let username = req.body.nameCustomer
    let email = req.body.emailCustomer
    let password = req.body.passwordCustomer

    User.register(email, username, password).then(result => {
        if(result == 'registration successful')
        {
            process.stdout.write('result: ' + result + ' ')
            res.render('user-login.ejs', { 
                pageTitle: 'Login',
                path: '/login',
                statusText: 'registration successful, login below'
            })
        }
        else if(result == 'username is taken')
        {
            process.stdout.write('result: ' + result + ' ')
            res.render('user-register.ejs', {   
                
                pageTitle: 'Register',
                path: '/register',
                statusText: result
            })
        }
        else if(result == 'email is taken')
        {
            process.stdout.write('result: ' + result + ' ')
            res.render('user-register.ejs', { 
                pageTitle: 'Register',
                path: '/register',
                statusText: result
            })
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
    process.stdout.write('post-register-restaurant > ')

    let email = req.body.emailRestaurant
    let address = req.body.addressRestaurant
    let phone = req.body.phoneRestaurant
    let owner = req.body.ownerRestaurant
    let city = req.body.city
    let restaurantName = req.body.nameRestaurant
    let companyIdNumber = req.body.companyIdNumberRestaurant
    let password = req.body.passwordRestaurant
    
    let registerRestaurant = await User.registerRestaurant(email, address, phone, owner, restaurantName, companyIdNumber, password, city)
    let result = registerRestaurant

    if(result == 'registration successful')
    {
        res.render('user-login.ejs', { 
            pageTitle: 'Login',
            path: '/login',
            statusText: 'registration successful'
        });
    }
    else if(result == 'email is taken')
    {
        res.render('user-register.ejs', { 
            pageTitle: 'Register',
            path: '/register',
            statusText: 'email is taken, try again with another email'
        })
    }
    else
    {
        res.render('user-register.ejs', { 
            pageTitle: 'Register',
            path: '/register',
            statusText: 'database error, try again in a few minutes'
        })   
    }
}

exports.postLogin = async (req, res, next) => {
    process.stdout.write('post-login > ')

    let email = req.body.email
    let password = req.body.password
    
    User.login(email, password).then(result => {

        if(result.statusText == 'login successful')
        {
            process.stdout.write('login user: ' + result.email + ' successful')

            Restaurant.findByEmail(result.email).then(restaurantCheck => {
                if(result.email == "admin@mail.com")
                {
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';path=/')
                    res.redirect('/admin')
                }
                else if(restaurantCheck != null)
                {
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';path=/')
                    res.redirect('/portal')
                }
                else if(restaurantCheck == null)
                {        
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';path=/')
                    res.redirect('/restaurants')
                }
            })   
        }

        else if(result == 'email is invalid')
        {
            process.stdout.write('login user: email is invalid')
            res.render('user-login.ejs', { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            })
        }
        else if(result == 'invalid password')
        {
            process.stdout.write('login user: invalid password')
            res.render('user-login.ejs', { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            })
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
    process.stdout.write('post-payment-webhook')

    let event = req.body

    // Handle the event
    if(event.type == 'payment_intent.succeeded') 
    {
        const paymentIntent = event.data.object
        process.stdout.write('PaymentIntent was successful!')
        // Return a 200 response to acknowledge receipt of the event  
        res.json({received: true})
    }
    else if(event.type == 'payment_method.attached')
    {
        const paymentMethod = event.data.object
        process.stdout.write('PaymentMethod was attached to a Customer!')
        // Return a 200 response to acknowledge receipt of the event  
        res.json({received: true})
    }
    else
    {
        // Unexpected event type
        return res.status(400).end()   
    }
}

exports.postUserUpdateCredentials = async (req, res, next) => {
    process.stdout.write('post-update-credentials')
    
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let email = req.body.email
    let name = req.body.name
    let phone = req.body.phone
    let address = req.body.address
    
    let updateUser = await User.updateCredentials(email, name, address, phone)

    res.redirect('/account')
}

exports.postUserUpdatePassword = async (req, res, next) => {
    process.stdout.write('post-update-password')

    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let email = req.body.email
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword

    let user = await User.findByEmail(email);
    
    //check old password
    if(user.password == oldPassword)
    {
        let updatePassword = await User.updatePassword(email, newPassword)
        res.redirect('/account?update=successful')
    }
    else
    {
        res.redirect('/account?update=oldpasswordincorrect')
    }
}

exports.postRestaurantReview = async (req, res, next) => {
    process.stdout.write('post-restaurant-review')

    let orderId = req.body.orderId
    let restaurant = req.body.restaurant
    let user = res.locals.userEmail
    let date = new Date()
    let name = req.body.customerName
    let rating = req.body.rating
    let items = req.body.items
    let comment = req.body.comment.toLowerCase()
    let reviewObject = {date: date, name: name, rating: rating, items: null, comment: comment}

    let checkIfOrderReviewExist = await Review.findByOrderId(orderId)

    if(checkIfOrderReviewExist == null)
    {
        let review = await Review.create(user, restaurant, reviewObject, orderId)
        let update = await Order.updateWithReview(orderId, reviewObject)
    }

    else if(checkIfOrderReviewExist != null)
    {
        let review = await Review.update(user, restaurant, reviewObject, orderId)
        let update = await Order.updateWithReview(orderId, reviewObject)
    }

    res.redirect("/orders");
}