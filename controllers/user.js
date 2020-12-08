const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Order = require('../models/order');
const Review = require('../models/review');
const Admin = require('../models/admin');
const stripe = require('stripe')('sk_test_51HEENaLFUjzCbJftCmqLgpLjLGgjY1OOI81cAAzEBmozVIetOISREohGCuuJq55KX3FGhFHvx9FENcU2zRdrIGmn00wIaynLwu');
const paypal = require('@paypal/checkout-server-sdk');



//******* functions *******
function parseLoginCookie(cookieId)
{
    var findLoginCookie = cookieId;

    if(findLoginCookie == null || findLoginCookie == 'loginCookie=')
    {
        return null;
    }
    
    var regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g;

    if(regexFindLoginCookieId == null)
    {
        return null;
    }

    var loginCookieId = findLoginCookie.match(regexFindLoginCookieId);
    //var regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g;
    //var loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail);

    var cookieId = parseFloat(loginCookieId);
    //console.log(String(loginCookieId));
    //console.log(String(loginCookieEmail))

    if(cookieId != null)
    {
        return cookieId;
    }

    else
    {
        return null;
    }
}



//******* uses login validation *******
exports.getRestaurants = (req, res, next) => {
    console.log('getRestaurants');
    let validation = res.locals.validation;

    //logged in user
    if(validation.status == true)
    {
        Restaurant.fetchAll()
        .then(restaurants => {
            res.render('user/restaurants', {
                admin: validation.isAdmin,
                loggedIn: true,
                prods: restaurants,
                path: '/restaurants',
                pageTitle: 'All Restaurants'

            });
        })
        .catch(err => console.log(err));
    }

    //anonymous user
    else
    {
        res.redirect('/');
    }
    
}

exports.getRestaurantDetail = async (req, res, next) => {
    console.log('getRestaurantDetail >');
    const restaurantUrl = req.params.restaurantUrl;
    console.log(restaurantUrl);

    let validation = res.locals.validation;
    
    if(validation == undefined)
    {
        validationStatus = false;
    }

    else
    {
        validationStatus = validation.status;
    }

    var restaurant = await Restaurant.findByUrl(restaurantUrl);

    //logged in user
    if(validationStatus == true)
    {
        if(restaurant != null)
        {   
            res.render('user/restaurant-detail', {
                admin: validation.isAdmin,
                loggedIn: true,
                IsOpen: restaurant.open,
                restaurant: restaurant,
                restaurantImage: "",
                restaurantUrl: restaurantUrl,
                path: '/restaurants'
            });
        }

        else
        {
            res.redirect('/');
        }

    }

    //anonymous user
    else
    {
        if(restaurant != null)
        {   
            res.render('user/restaurant-detail', {
                admin: false,
                loggedIn: false,
                IsOpen: restaurant.open,
                restaurant: restaurant,
                restaurantImage: "",
                restaurantUrl: restaurantUrl,
                path: '/restaurants'
            });
        }
        
        else
        {
            res.redirect('/');
        }

    }

}

exports.getIndex = async (req, res, next) => {
    console.log('getIndex\n');
    console.log(req.ip);
    console.log(req.connection.remoteAddress);
    console.log(req.socket.remoteAddress);
    console.log(req.headers['x-forwarded-for']);

    let validation = res.locals.validation;
    let email = res.locals.userEmail;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        res.render('user/index', 
        { 
            pageTitle: 'Home',
            path: '/',
            admin: validation.isAdmin,
            loggedIn: true,
        });
    }

    //logged in user
    else if(validation.status == true)
    {
        var adminPosts = await Admin.fetchAllPosts()

        res.render('user/index', 
        { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: true,
            adminPosts: adminPosts
        });
    }

    //anonymous user
    else
    {
        res.render('user/index', 
        { 
            pageTitle: 'Food Ordering Platform',
            path: '/',
            admin: false,
            loggedIn: false,
        });
    }
    
}

exports.getRestaurantList = async (req, res, next) => {
    console.log('getRestaurantList\n');
    let validation = res.locals.validation;
    let validationStatus = null;
    
    if(validation == undefined)
    {
        validationStatus = false;
    }

    else
    {
        validationStatus = validation.status;
    }
    
    var restaurants = await Restaurant.fetchAll();
    var reviews = await Review.fetchAll();
    
    //logged in user
    if(validationStatus == true)
    {
        res.render('user/restaurants', {
            admin: validation.isAdmin,
            loggedIn: true,
            restaurantImage: "",
            restaurants: restaurants,
            reviews: reviews,
            path: '/restaurants'
        });
    }

    //anon user
    else
    {
        res.render('user/restaurants', {
            admin: false,
            loggedIn: false,
            restaurantImage: "",
            restaurants: restaurants,
            reviews: reviews,
            path: '/restaurants'
        });
    }       
    
}

exports.getOrders = (req, res, next) => {
    console.log('getOrders');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;

    //logged in user
    if(validation.status == true)
    {
        Order.FindByUser(userEmail).then(orders => {
            res.render('user/orders', 
            {
                admin: validation.isAdmin,
                loggedIn: true,
                orders: orders,
                path: '/orders',
                pageTitle: 'Orders'
            });
        })

    }

    //anonymous user
    else
    {
        res.render('user/index', 
        { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: false,
        });
    }
}

exports.postOrder = async (req, res, next) => {
    console.log('postOrder >');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;
    
    let cartItems = req.body.cartAllItems;
    let totalPrice = req.body.cartTotalPrice;
    let restaurant = req.body.restaurant;
    let customerName = req.body.customerName;
    let customerPhone = req.body.customerPhone;
    let customerAddress = req.body.customerAddress;
    let customerDelivery = req.body.customerDelivery;
    let customerComment = req.body.customerComment;
    let orderProducts = JSON.parse(cartItems);

    //logged in user
    if(validation.status == true)
    {
         var r = await Restaurant.findByUrl(restaurant);
         var restaurantTitle  = r.title;
         var createOrder = await Order.createOrder(userEmail, orderProducts, totalPrice, customerComment, restaurant, customerName, customerPhone, customerAddress, customerDelivery, restaurantTitle);
         var orderId = createOrder.ops[0]._id;

         if(createOrder.insertedCount != null)
         {
            console.log('create order: successful');
            res.redirect("/order-process/" + orderId);
         }
        
         else
         {
             console.log('create order: failed');
             res.redirect('/');
         }
     }

     //anonymous user
     else
     {
         res.redirect('/');
     }
}

exports.getCheckout = async (req, res, next) => {
    console.log('getCheckout');
    let validation = res.locals.validation;
    let email = res.locals.userEmail;    
    
    let cartItems = req.body.cartAllItems;
    let customerComment = req.body.customerComment;
    let cartTotalPrice = req.body.cartTotalPrice;
    let restaurant = req.body.restaurant;

    var user = await User.findByEmail(email);

    const intent = await stripe.paymentIntents.create({
        amount: 100, //cartTotalPrice 
        currency: 'usd', 
        
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
    });
    
    //logged in user
    if(validation.status == true && cartItems != null)
    {
        res.render('user/checkout', 
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
        });
    }

    //anonymous user
    else
    {
        res.redirect('/');
    }
}

exports.getLogout = (req, res, next) => {
    console.log('getLogout');
    let validation = res.locals.validation;
            
    //logged in user
    if(validation.status == true)
    {
        res.render('user/logout', {
            admin: validation.isAdmin,
            loggedIn: true,
            pageTitle: 'Logout',
            path: '/logout',
            statusText: ''
        })
    }

    //anonymous user
    else
    {
        res.redirect('/');
    }
}

exports.postLogout = (req, res, next) => {  
    console.log('postLogout >');
    let logoutSuccessful = 1;
    let logoutFailed = 0;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    let validation = res.locals.validation;

    res.setHeader('Set-Cookie', 'loginCookie="";expires=Thu, 01 Jan 1970 00:00:01 GMT;');
    
    //logged in user
    if(validation.status == true)
    {
        User.logout(loginCookie).then(result => {
            if(result == logoutSuccessful)
            {
                console.log('logout succesful')
                res.redirect('/');
            }
    
            else
            {
                console.log('logout failed')
                res.render('user/logout', 
                { 
                    pageTitle: 'Logout',
                    path: '/logout',
                    statusText: 'logout failed, try again in a few minutes'
                })
            }
        });
    }

    else
    {
        res.redirect('/');
    }

}

exports.getProfile = async (req, res, next) => {
    console.log('getProfile');
    
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    let update = req.query.update;

    var user = await User.findByCookieIdReturnUserObject(cookieId);

    //logged in user
    if(validation.status == true)
    {
        res.render('user/profile', 
        { 
            admin: validation.isAdmin,
            loggedIn: true,
            pageTitle: 'Profile',
            path: '/profile',
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            update: update
        });
    }

    //anon user
    else
    {
        res.render('user/index', 
        { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: false,
        });
    }
}



//******* no validation *******
exports.postRegister = (req, res, next) => {
    console.log('\npostRegister >');
    
    const username = req.body.nameCustomer;
    const email = req.body.emailCustomer;
    const password = req.body.passwordCustomer;

    User.register(email, username, password).then(result => {

            if(result == 'registration successful')
            {
                res.render('user/login', 
                { 
                    pageTitle: 'Login',
                    path: '/login',
                    statusText: 'registration successful, login below'
                });
            }

            else if(result == 'username is taken')
            {
                console.log('result: ' + result + '\n')

                res.render('user/register', 
                {   
                    
                    pageTitle: 'Register',
                    path: '/register',
                    statusText: result
                });
            }

            else if(result == 'email is taken')
            {
                console.log('result: ' + result + '\n')

                res.render('user/register', 
                { 
                    pageTitle: 'Register',
                    path: '/register',
                    statusText: result
                });
            }

            else
            {
                console.log('result: ' + 'database error')

                res.render('user/register', 
                { 
                    pageTitle: 'Register',
                    path: '/register',
                    statusText: 'database error, try again in a few minutes'
                });   
            }
        });
}

exports.postRegisterRestaurant = async (req, res, next) => {
    console.log('\npostRegisterRestaurant >');

    var email = req.body.emailRestaurant;
    var address = req.body.addressRestaurant;
    var phone = req.body.phoneRestaurant;
    var owner = req.body.ownerRestaurant;
    var city = req.body.city;
    var restaurantName = req.body.nameRestaurant;
    var companyIdNumber = req.body.companyIdNumberRestaurant;
    var password = req.body.passwordRestaurant;
    
    var registerRestaurant = await User.registerRestaurant(email, address, phone, owner, restaurantName, companyIdNumber, password, city);
    var result = registerRestaurant;

    if(result == 'registration successful')
    {
        res.render('user/login', 
        { 
            pageTitle: 'Login',
            path: '/login',
            statusText: 'registration successful'
        });
    }

    else if(result == 'email is taken')
    {
        res.render('user/register', 
        { 
            pageTitle: 'Register',
            path: '/register',
            statusText: 'email is taken, try again with another email'
        });
    }

    else
    {
        res.render('user/register', 
        { 
            pageTitle: 'Register',
            path: '/register',
            statusText: 'database error, try again in a few minutes'
        });   
    }
        
}

exports.getRegister = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getRegister');

    res.render('user/register', {
        pageTitle: 'Register',
        path: '/register',
        statusText: ''
    })
}

exports.getLogin = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getLogin');

    res.render('user/login', {
        pageTitle: 'Login',
        path: '/login',
        statusText: ''
    })
}

exports.postLogin = async (req, res, next) => {
    console.log('\npostLogin >');
    const email = req.body.email;
    const password = req.body.password;
    
    User.login(email, password).then(result => {

        if(result.statusText == 'login successful')
        {
            console.log('login user: ' + result.email + ' successful');

            Restaurant.findByEmail(result.email).then(restaurantCheck => {
                if(restaurantCheck != null)
                {
                    var cookie = req.get('Cookie');
                    
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';path=/');
                    //res.setHeader('Set-Cookie', 'loginCookie=' + uuidv4() + ';path=/')
                    res.redirect('/restaurantPortal');
                }
    
                else if(restaurantCheck == null)
                {        
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';path=/')
                    res.redirect('/');
                }
            });          
        }

        else if(result == 'email is invalid')
        {
            console.log('login user: email is invalid');
            res.render('user/login', 
            { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            });
        }

        else if(result == 'invalid password')
        {
            console.log('login user: invalid password');
            res.render('user/login', 
            { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            });
        }

        else if(result == 'database error, try again in a few minutes')
        {
            console.log('login user: database error');
            res.render('user/login', 
            { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            });
        }
    })

}

exports.getStripe = async (req, res, next) => {
    console.log('\ngetStripe');

    const intent = await stripe.paymentIntents.create({
        amount: 100,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
      });
    
    res.render('shop/stripe', 
    { 
        amount: intent.amount,
        currency: intent.currency,
        client_secret: intent.client_secret 
    });

}

exports.getOrderDetails = async (req, res, next) => {
    console.log('\ngetOrderDetails');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;

    var orderId = req.params.orderId;

    var order = await Order.findById(orderId);

    if(order != null)
    {
        if(validation.status == true)
        {
            res.render('user/order-details', 
            { 
                admin: validation.isAdmin,
                pageTitle: 'Order Details',
                path: '/order-details',
                loggedIn: true,
                order: order,
            });
        }

        else
        {
            res.redirect('/');
        }
    }

    else
    {
        res.redirect('/');
    }

}

exports.getOrderProcess = async (req, res, next) => {
    console.log('\ngetOrderProcess');
    
    var orderId = req.params.orderId;
    var order = await Order.findById(orderId);

    if(order != null && order.status == "unconfirmed")
    {
        res.render('user/order-process', 
        { 
            order: order
        });
    }

    else
    {
        res.redirect('/');
    }

}

exports.postOrderUpdate = async (req, res, next) => {
    console.log('\npostOrderUpdate Test');

    orderId = req.body.orderId;
    status = req.body.status;
    estimatedCompletionTime = req.body.estimatedTime;

    var order = await Order.updateOne(orderId, status, estimatedCompletionTime);

    res.redirect('back');
}

exports.postWebhook = (req, res, next) => {
    console.log('\npostWebhook Test');

    let event = req.body;

    // Handle the event
    if(event.type == 'payment_intent.succeeded') 
    {
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!');
        // Return a 200 response to acknowledge receipt of the event  
        res.json({received: true});
    }

    else if(event.type == 'payment_method.attached')
    {
        const paymentMethod = event.data.object;
        console.log('PaymentMethod was attached to a Customer!');
        // Return a 200 response to acknowledge receipt of the event  
        res.json({received: true});
    }

    else
    {
        // Unexpected event type
        return res.status(400).end();   
    }
  
}

exports.postUserUpdateCredentials = async (req, res, next) => {
    console.log('\npostUserUpdateCredentials Test');
    
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    var email = req.body.email;
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.address;
    
    var updateUser = await User.updateCredentials(email, name, address, phone);

    res.redirect('/profile');
}

exports.postUserUpdatePassword = async (req, res, next) => {
    console.log('\npostUserUpdatePassword Test');

    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    var email = req.body.email;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    var user = await User.findByEmail(email);
    
    //check old password
    if(user.password == oldPassword)
    {
        var updatePassword = await User.updatePassword(email, newPassword);
        res.redirect('/profile?update=successful');
    }

    else
    {
        res.redirect('/profile?update=oldpasswordincorrect');
    }

}

exports.postRestaurantReview = async (req, res, next) => {
    console.log('postUserRestaurantReview');

    var orderId = req.body.orderId;
    var restaurant = req.body.restaurant;
    var user = res.locals.userEmail;
    var date = new Date();
    var name = req.body.customerName;
    var rating = req.body.rating;
    var items = req.body.items;
    var comment = req.body.comment;
    reviewObject = {date: date, name: name, rating: rating, items: items, comment: comment};

    var checkIfOrderReviewExist = await Review.findByOrderId(orderId);

    if(checkIfOrderReviewExist == null)
    {
        var review = await Review.create(user, restaurant, reviewObject, orderId);
        var update = await Order.updateWithReview(orderId, reviewObject);
    }

    else if(checkIfOrderReviewExist != null)
    {
        var review = await Review.update(user, restaurant, reviewObject, orderId);
        var update = await Order.updateWithReview(orderId, reviewObject);
    }

    res.redirect("/orders");
    
}

exports.getAbout = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getAbout');

    res.render('user/about', {})
}

exports.getContact = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getContact');

    res.render('user/contact', {})
}



//tests
exports.getTest = async (req, res, next) => {
    console.log('getTest');

    res.render('test/test.ejs', { });
}

exports.getGoogleMapsApiTest = async (req, res, next) => {
    console.log('getTest');
    console.log(req.body);
    console.log(res.locals.userEmail);

    res.render('test/googleMapsApi.ejs', 
    { 

    });
}

exports.getPayPalCreateOrder = async (req, res, next) => {
    console.log("getPayPalCreateOrder");
    console.log(req.body);

    var amount = "temp";

    //Creating an environment
    let clientId = "AVm4xAcY_8YjJjr-nN4_YYUrEx5N8K_-gvJP0jtZbFc_aqApF6pmZGs4i4xzbUNp77tsC3NT5zHmtBiP";
    let clientSecret = "EKV9wYIfLMjnapE4Erg-9Z7AUE-yWmcj2TzcWmbthC8U8_BlyihIFKnMwAX-Ouu46R9nUwYjS2jHw0oz";

    //This sample uses SandboxEnvironment. In production, use LiveEnvironment
    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    //Construct a request object and set desired parameters
    //Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody(
        {
            "intent": "CAPTURE",
            "application_context": {
                "return_url": "http://localhost:3000/paypalSuccess",
                "cancel_url": "http://localhost:3000/paypalCancel"
            },
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": "1.00"
                    }
                }
            ]
        }
    );

    //Call API with your client and get a response for your call
    let createOrder = async function()
    {
        let response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);
        
        //If call returns body in response, you can get the deserialized version from the result attribute of the response.
        console.log(`Order: ${JSON.stringify(response.result)}`);
        var orderId = response.result.id;
        var status = response.result.status;
        var httpAdress = response.result.links[1].href;
        console.log(response.result.id);
        console.log(response.result.status);
        console.log(response.result.links[1].href);

        if(status === "CREATED")
        {
            res.redirect(httpAdress);
        }

        else
        {
            res.redirect('/temp');
        }
    }

    //Start
    createOrder();
}

exports.getPayPalSuccess = async (req, res, next) => {
    console.log("getPayPalSuccess");
    console.log(req.query);

    const payerID = req.query.PayerID;
    console.log(payerID);
    const token = req.query.token;
    console.log(token);
    var approvedOrderId = token;

    //Creating an environment
    let clientId = "AVm4xAcY_8YjJjr-nN4_YYUrEx5N8K_-gvJP0jtZbFc_aqApF6pmZGs4i4xzbUNp77tsC3NT5zHmtBiP";
    let clientSecret = "EKV9wYIfLMjnapE4Erg-9Z7AUE-yWmcj2TzcWmbthC8U8_BlyihIFKnMwAX-Ouu46R9nUwYjS2jHw0oz";

    //This sample uses SandboxEnvironment. In production, use LiveEnvironment
    let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    let client = new paypal.core.PayPalHttpClient(environment);

    let processOrder = async function(orderId) 
    {
        request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        // Call API with your client and get a response for your call
        let response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);

        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        console.log(`Capture: ${JSON.stringify(response.result)}`);
        
        // If payment successful
        if(response.result.status === "COMPLETED")
        {
            res.redirect('/temp');
        }

        // If payment error
        else
        {
            res.redirect('/temp');
        }
    }

    let process = processOrder(token);

}

exports.getPayPalCancel = async (req, res, next) => {
    console.log("getPayPalCancel");

    res.redirect('/');
}