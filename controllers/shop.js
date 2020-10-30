const Restaurant = require('../models/restaurant');
const Cart = require('../models/cart');
const User = require('../models/user');
const Session = require('../models/session');
const Order = require('../models/order');
const Review = require('../models/review');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
const mongodb = require('mongodb');
const stripe = require('stripe')('sk_test_51HEENaLFUjzCbJftCmqLgpLjLGgjY1OOI81cAAzEBmozVIetOISREohGCuuJq55KX3FGhFHvx9FENcU2zRdrIGmn00wIaynLwu');
const paypal = require('@paypal/checkout-server-sdk');


//******* variables *******
const ObjectId = mongodb.ObjectId;



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
            res.render('shop/shop-restaurant-list', {
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

    //.then(User.findByUsername);
    
    /*
    Product.fetchAll()
        .then(products => {
            res.render('shop/shop-product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
    */
}

exports.getRestaurantDetail = async (req, res, next) => {
    console.log('getRestaurantDetail >');
    const restaurantUrl = req.params.restaurantUrl;
    console.log(restaurantUrl);
    console.log("");

    //console.log('ProdId: ' + String(req.params.restaurantId));
    let validation = res.locals.validation;
    //let validationStatus = null;
    
    if(validation == undefined)
    {
        validationStatus = false;
    }

    else
    {
        validationStatus = validation.status;
    }

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    //console.log(restaurant);

    //logged in user
    if(validationStatus == true)
    {
        if(restaurant != null)
        {   
            res.render('shop/restaurant-detail', {
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
            res.render('shop/restaurant-detail', {
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

exports.getIndex = (req, res, next) => {
    //res.setHeader('Set-Cookie', 'testCookie=kasldalkdslkd');
    
    /*
    Product.fetchAll()
        .then(([rows], fieldData) => {
            res.render('shop/index', 
            { 
                prods: rows,
                pageTitle: 'Home',
                path: '/'
            });
        })
        .catch(err => console.log(err));
    */

    console.log('getIndex\n');
    let validation = res.locals.validation;
    let email = res.locals.userEmail;

    //console.log(res.locals.text);
    //console.log(validation);
    //console.log(validation.status);
    //console.log(validation.isAdmin);

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        res.render('shop/index', 
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
        res.render('shop/index', 
        { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: true,
        });
    }

    //anonymous user
    else
    {
        res.render('shop/index', 
        { 
            pageTitle: 'Home',
            path: '/',
            admin: false,
            loggedIn: false,
        });
    }
    
}

exports.getCart = (req, res, next) => {
    console.log('getCart');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;
    let cartProducts = [];

    //logged in user
    if(validation.status == true)
    {
        User.fetchCart(userEmail).then(cartProducts => {
            res.render('shop/cart', 
            {
                admin: validation.isAdmin,
                loggedIn: true,
                cartProducts: cartProducts,
                path: '/cart',
                pageTitle: 'Your Cart'
            });
        })
    }

    else
    {
        res.redirect('/');
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
    
    let userEmail = res.locals.userEmail;
    let addToCartSuccessful = 1;
    let addoCartFailed = 0;    
    
    //const restaurantUrl = req.params.restaurantUrl;
    //console.log(restaurantUrl);
    //console.log(restaurantId);
    //console.log(userEmail);

    var restaurants = await Restaurant.fetchAll();
    var reviews = await Review.fetchAll();
    
    //logged in user
    if(validationStatus == true)
    {
        res.render('shop/shop-restaurant-list', {
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
        res.render('shop/shop-restaurant-list', {
            admin: false,
            loggedIn: false,
            restaurantImage: "",
            restaurants: restaurants,
            reviews: reviews,
            path: '/restaurants'
        });
    }       
    
}

exports.getAddToCart = (req, res, next) => {
    console.log('getCartx');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;
    let cartProducts = [];
    console.log('postCartx >');
    const productId = req.params.productId;
    const menuItemId = req.params.menuItemId;
    console.log(productId);
    console.log(menuItemId);
    let addToCartSuccessful = 1;
    let addoCartFailed = 0;

    //console.log(productId);
    //console.log(userEmail);
    
    //logged in user
    if(validation.status == true)
    {
        Restaurant.findById(ObjectId(productId))
        .then(resultProduct => 
        {
            let menuItemsArray = resultProduct.menu;
            let menuItem = null;
            console.log(resultProduct.menu);

            for(let c = 0; c < menuItemsArray.length; c++)
            {
                if(menuItemsArray[c].productId == menuItemId)
                {
                    menuItem = c;
                }
            }

            let title = menuItemsArray[menuItem].title;
            let price = menuItemsArray[menuItem].price;
            let description = menuItemsArray[menuItem].description;
            let cartArray = [];
            let checkProductExists = false;

            User.fetchCart(userEmail)
            .then(result => {
                //if users cart have items in it
                if(result != null)
                {
                    cartArray = result;
                    
                    //checks if product already exists in cart and if true increments quantity
                    for (elementCtr = 0; elementCtr < cartArray.length; elementCtr++) 
                    {   
                        if(cartArray[elementCtr].productId == menuItemId)
                        {
                            cartArray[elementCtr].quantity++;
                            checkProductExists = true;
                        }
                    }

                    if(checkProductExists != true)
                    {
                        cartArray.push({productId: menuItemId, title: title, quantity: 1, price: price, description: description});
                        //cartArray.push({productId: ObjectId(productId), title: title, quantity: 1, price: price, description: description});
                    }
                    
                    User.addToCart(userEmail, cartArray)
                    .then(result => {
                        if(result == addToCartSuccessful)
                        {
                            console.log('add item to cart: successful');
                            res.redirect("/restaurant/" + productId);
                        }

                        else 
                        {
                            console.log('add item to cart: failed');
                            res.redirect('/product-list');
                        }
                    })
                    .catch(err => {console.log(err)});
                }

                //if users cart is empty
                else
                {
                    cartArray.push({productId: menuItemId, title: title, quantity: 1, price: price, description: description});
                    
                    User.addToCart(userEmail, cartArray)
                    .then(result => {
                        if(result == addToCartSuccessful)
                        {
                            console.log('add item to cart: successful');
                            res.redirect("/restaurant/" + productId);
                        }

                        else 
                        {
                            console.log('add item to cart: failed');
                            res.redirect('/product-list');
                        }
                    })
                    .catch(err => {console.log(err)});
                }

            }).catch(err => {console.log(err)});
        
        }).catch(err => {console.log(err)});
    }

    //anon user
    else
    {
        res.redirect('/');
    }       
    
}

exports.postCart = (req, res, next) => {   
    console.log('postCart >');
    const productId = req.params.productId;
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;
    let addToCartSuccessful = 1;
    let addoCartFailed = 0;

    //console.log(productId);
    //console.log(userEmail);
    
    //logged in user
    if(validation.status == true)
    {
        Restaurant.findById(ObjectId(productId))
        .then(result => 
        {
            let title = result.title;
            let price = result.price;
            let description = result.description;
            let cartArray = [];
            let checkProductExists = false;

            User.fetchCart(userEmail)
            .then(result => {
                //if users cart have items in it
                if(result != null)
                {
                    cartArray = result;
                    
                    //checks if product already exists in cart and if true increments quantity
                    for (elementCtr = 0; elementCtr < cartArray.length; elementCtr++) 
                    {   
                        if(cartArray[elementCtr].productId == productId)
                        {
                            cartArray[elementCtr].quantity++;
                            checkProductExists = true;
                        }
                    }

                    if(checkProductExists != true)
                    {
                        cartArray.push({productId: ObjectId(productId), title: title, quantity: 1, price: price, description: description});
                    }
                    
                    User.addToCart(userEmail, cartArray)
                    .then(result => {
                        if(result == addToCartSuccessful)
                        {
                            console.log('add item to cart: successful');
                            res.redirect('/product-list');
                        }

                        else 
                        {
                            console.log('add item to cart: failed');
                            res.redirect('/product-list');
                        }
                    })
                    .catch(err => {console.log(err)});
                }

                //if users cart is empty
                else
                {
                    cartArray.push({productId: ObjectId(productId), title: title, quantity: 1, price: price, description: description});
                    
                    User.addToCart(userEmail, cartArray)
                    .then(result => {
                        if(result == addToCartSuccessful)
                        {
                            console.log('add item to cart: sucessful');                            
                            res.redirect('/product-list');
                        }

                        else 
                        {
                            console.log('add item to cart: failed');
                            res.redirect('/product-list');
                        }
                    })
                    .catch(err => {console.log(err)});
                }

            }).catch(err => {console.log(err)});
        
        }).catch(err => {console.log(err)});
    }

    //anon user
    else
    {
        res.redirect('/');
    }
   
        /*
        User
            .findById()
            .then()
            .catch()

        Product
        .findById(prodId)
        .then(product => {
            
            res.render('shop/cart', {
                productImage: "",
                product: product,
                path: 'shop/cart'
            });
        })
        .catch(err => console.log(err));
        */
        //anonymous user
    
}

exports.getOrders = (req, res, next) => {
    console.log('getOrders');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;

    //logged in user
    if(validation.status == true)
    {
        Order.FindByUser(userEmail).then(orders => {
            res.render('shop/orders', 
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
        res.render('shop/index', 
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
    let insertSuccessful = 1;
    //let cartItems = req.body.cartAllItems;
    //let totalPrice = req.body.cartTotalPrice;
    //let commentToRestaurant = req.body.commentToRestaurant;

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
        var createOrder = await Order.createOrder(userEmail, orderProducts, totalPrice, customerComment, restaurant, customerName, customerPhone, customerAddress, customerDelivery);
        
        var orderId = createOrder.ops[0]._id;

        if(createOrder.insertedCount != null)
        {
            console.log('create order: successful');
            //res.redirect('/orders');
            res.redirect("/order-process/" + orderId);
            
            /*
            let order;
            order = result.ops;

            let id = order[0]._id;
            let user = order[0].user;
            let date = order[0].date;
            let products = order[0].products;
            let totalPrice = order[0].totalPrice;
                                    
            //create order pdf
            const reciept = 'Reciept=' + id + '.pdf';
            const recieptPath = path.join(__dirname, '..', 'public/' + 'orderReciepts', reciept);
            const pdfReciept = new pdfDocument();
        
            //console.log(reciept);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + reciept + '"');
            
            pdfReciept.pipe(fs.createWriteStream(recieptPath));
            //pdfReciept.pipe(res); redirects to pdf document
            //pdfReciept.fontSize(26).text('Reciept', {
                //underline: true
            //})

            //write pdf start
            try 
            {
                pdfReciept.text('Order: ' + id)
                pdfReciept.text('\n');
                pdfReciept.text('Date: ' + date);
                pdfReciept.text('\n');
                pdfReciept.text('User: ' + user);
                pdfReciept.text('\n');
                pdfReciept.text('Total Products: ' + products.length);
                pdfReciept.text('\n');
                pdfReciept.text('Total Amount: ' + totalPrice);
                pdfReciept.text('\n');
                for(elementCounter = 0; elementCounter < products.length; elementCounter++)
                {
                    pdfReciept.text('\n');
                    pdfReciept.text('#' + (elementCounter + 1));
                    pdfReciept.text(products[elementCounter].title);
                    pdfReciept.text('quantity: ' + products[elementCounter].quantity);
                    pdfReciept.text('price: ' + products[elementCounter].price);
                    pdfReciept.text('description: ' + products[elementCounter].description);
                    pdfReciept.text('\n');
                }
                pdfReciept.end();

                console.log('create pdf: successful');
                res.redirect('/orders');
            } 
            catch (error) 
            {
                console.log('create pdf: failed');
                console.log(error);
                res.redirect('/orders');   
            }
            */

        }
        
        else
        {
            console.log('create order: failed');
            res.redirect('/cart');
        }
    }

    //anonymous user
    else
    {
        res.redirect('/');
    }
}

exports.getReciept = (req, res, next) => {
    console.log('getReciept >');
    let recieptId = req.params.orderId;
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;

    //logged in user
    if(validation.status == true)
    {
        Order.findById(recieptId)
        .then(result => {
            if(userEmail == result.user)
            {
                console.log('reciept fetch: successful');
                res.redirect('/orderReciepts/' + 'Reciept=' + recieptId + '.pdf');
                    
            }

            else
            {
                console.log('reciept fetch: failed');
                res.redirect('/orders');
            }
        })
        .catch(err => {console.log(err)})
    }

    //anon
    else
    {
        console.log('reciept fetch: access denied');
        res.redirect('/');
    }

    /*
    const orderId = req.params.orderId;
    const reciept = 'reciept' + orderId + '.pdf';
    const recieptPath = path.join('reciepts', reciept);
    const pdfReciept = new pdfDocument();

    console.log(reciept);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + reciept + '"');
    
    pdfReciept.pipe(fs.createWriteStream(recieptPath));
    pdfReciept.pipe(res);
    pdfReciept.fontSize(26).text('Reciept', {
        //underline: true
    })
    pdfReciept.text('Example text');
    pdfReciept.end();
     
    //preload
    /*
    fs.readFile(recieptPath, (err, recieptFile) => {
        if(err)
        {
            return next(err)
        }

        else
        {
            //inline == in browser
            //attachment == download window
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="' + reciept + '"');
            res.send(recieptFile);
        }
    })
    */

    //stream
    /*
    const file = fs.createReadStream(recieptPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + reciept + '"');
    file.pipe(res);
    */
}

exports.getCheckout = async (req, res, next) => {
    console.log('getCheckout');
    let validation = res.locals.validation;
    let email = res.locals.userEmail;    
    let cartItems = req.body.cartAllItems;
    let customerComment = req.body.customerComment;
    let cartTotalPrice = req.body.cartTotalPrice;
    let restaurant = req.body.restaurant;
    //let currency = req.body.currency;
    //console.log(req.body.cartAllItems);
    //console.log(req.body.cartTotalPrice);
    //console.log(req.body);

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
        res.render('shop/checkout', 
        {
            path: '/checkout',
            pageTitle: 'Checkout',
            customerName: user.email,
            customerAddress: user.address,
            customerPhone: user.phone,
            customerComment: customerComment,
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
                res.render('shop/logout', {
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
    res.setHeader('Set-Cookie', 'loginCookie=');  
    let logoutSuccessful = 1;
    let logoutFailed = 0;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    let validation = res.locals.validation;
    
    //logged in user
    if(validation.status == true)
    {
        User.logout(loginCookie).then(result => {
            if(result == logoutSuccessful)
            {
                //console.log('logout succesful')
                res.redirect('/');
            }
    
            else
            {
                //console.log('logout failed')
                res.render('shop/logout', 
                { 
                    pageTitle: 'Logout',
                    path: '/logout',
                    statusText: 'logout failed, try again in a few minutes'
                });
            }
        })
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

    var user = await User.findByCookieIdReturnUserObject(cookieId);

    //logged in user
    if(validation.status == true)
    {
        res.render('shop/profile', 
        { 
            admin: validation.isAdmin,
            loggedIn: true,
            pageTitle: 'Profile',
            path: '/profile',
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone
        });
    }

    //anonymous user
    else
    {
        res.render('shop/index', 
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

    User.register(email, username, password)
        .then(result => {
            //console.log("result:");
            //console.log(result)

            if(result == 'registration successful')
            {
                res.render('shop/login', 
                { 
                    pageTitle: 'Login',
                    path: '/login',
                    statusText: 'registration successful, login below'
                });
            }

            else if(result == 'username is taken')
            {
                console.log('result: ' + result + '\n')

                res.render('shop/register', 
                {   
                    
                    pageTitle: 'Register',
                    path: '/register',
                    statusText: result
                });
            }

            else if(result == 'email is taken')
            {
                console.log('result: ' + result + '\n')

                res.render('shop/register', 
                { 
                    pageTitle: 'Register',
                    path: '/register',
                    statusText: result
                });
            }

            else
            {
                console.log('result: ' + 'database error')

                res.render('shop/register', 
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
    var restaurantName = req.body.nameRestaurant;
    var companyIdNumber = req.body.companyIdNumberRestaurant;
    var password = req.body.passwordRestaurant;
    
    var registerRestaurant = await User.registerRestaurant(email, address, phone, owner, restaurantName, companyIdNumber, password);
    var result = registerRestaurant;
    //console.log(registerRestaurant);

    if(result == 'registration successful')
    {
        res.render('shop/login', 
        { 
            pageTitle: 'Login',
            path: '/login',
            statusText: 'registration successful, login below'
        });
    }

    else if(result == 'email is taken')
    {
        res.render('shop/register', 
        { 
            pageTitle: 'Register',
            path: '/register',
            statusText: 'email is taken, try again with another email'
        });
    }

    else
    {
        res.render('shop/register', 
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

    res.render('shop/register', {
        pageTitle: 'Register',
        path: '/register',
        statusText: ''
    })
}

exports.getLogin = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getLogin');

    res.render('shop/login', {
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
        //console.log("result: " + result);

        if(result.statusText == 'login successful')
        {
            console.log('login user: ' + result.email + ' successful');

            Restaurant.findByEmail(result.email).then(restaurantCheck => {
                if(restaurantCheck != null)
                {
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';')
                    res.redirect('/portal');
                }
    
                else
                {
                    //console.log(result.statusText);
                    //console.log(result.cookieId);
        
                    res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';')
                    res.redirect('/');
                }
            });          
        }

        else if(result == 'email is invalid')
        {
            console.log('login user: email is invalid');
            res.render('shop/login', 
            { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            });
        }

        else if(result == 'invalid password')
        {
            console.log('login user: invalid password');
            res.render('shop/login', 
            { 
                pageTitle: 'Login',
                path: '/login',
                statusText: result
            });
        }

        else if(result == 'database error, try again in a few minutes')
        {
            console.log('login user: database error');
            res.render('shop/login', 
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

    orderId = req.params.orderId;

    var order = await Order.findById(orderId);
    //console.log(order);

    if(order != null)
    {
        var totalPrice = order.totalPrice;
        var orderDate = order.date;
        var orderItems = order.products.items;
        
        if(validation.status == true)
        {
            res.render('shop/order-details', 
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
    
    orderId = req.params.orderId;

    var order = await Order.findById(orderId);
    //console.log(order);

    if(order != null && order.status == "unconfirmed")
    {
        var totalPrice = order.totalPrice;
        var orderDate = order.date;
        var orderItems = order.products.items;
        var orderPickup = order.pickUp;
        var orderDelivery = order.delivery;
    
        res.render('shop/order-process', 
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

exports.postOrderDetails = async (req, res, next) => {
    console.log('\npostOrderDetails Test');

    console.log(req.body);
    
    let event = req.body;
    
    /*
    res.render('shop/order-details', 
    { 
        orderId, orderId,
        orderDate: orderDate,
        totalPrice: totalPrice,
        orderItems: orderItems
    });
    */
}

exports.postWebhook = (req, res, next) => {
    console.log('\npostWebhook Test');

    //console.log(req.body);
    
    let event = req.body;

    /*
    try 
    {
        event = JSON.parse(req.body);
    } 
    catch (err) 
    {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
    */
    
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

exports.getUnconfirmedOrders = async (req, res, next) => {
    console.log('\ngetUnconfirmedOrders');

    var orders = await Order.fetchAllUnconfirmed();
    
    res.render('shop/orders-unconfirmed', 
    { 
        orders: orders
    });

}

exports.getConfirmedOrders = async (req, res, next) => {
    console.log('\ngetConfirmedOrders');

    var orders = await Order.fetchAllConfirmed();
    
    res.render('shop/orders-confirmed', 
    { 
        orders: orders
    });

}

exports.getDeclinedOrders = async (req, res, next) => {
    console.log('\ngetConfirmedOrders');

    var orders = await Order.fetchAllDeclined();
    
    res.render('shop/orders-declined', 
    { 
        orders: orders
    });

}

exports.getCompletedOrders = async (req, res, next) => {
    console.log('\ngetCompletedOrders');

    var orders = await Order.fetchAllCompleted();
    
    res.render('shop/orders-completed', 
    { 
        orders: orders
    });

}

exports.postUserUpdateCredentials = async (req, res, next) => {
    console.log('\npostUserUpdateCredentials Test');

    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    console.log(cookieId);
    
    var oldEmail = req.body.oldEmail;
    var newEmail = req.body.newEmail;
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.address;
    
    var updateUser = await User.updateCredentials(oldEmail, newEmail, name, address, phone);

    //var deleteSession = await Session.deleteOne(cookieId);

    //res.setHeader('Set-Cookie', 'loginCookie='); 

    //res.redirect('/');

    res.redirect('/profile');
}

exports.getAbout = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getAbout');

    res.render('shop/about', {

    })
}

exports.getContact = (req, res, next) => {
    console.log('\nanon user >');
    console.log('getContact');

    res.render('shop/contact', {

    })
}

//portal restaurant
exports.getRestaurantIndex = async (req, res, next) => {
    console.log('\ngetPortalRestaurant Test');
    
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;
    console.log(userEmail);
    console.log(restaurantUrl);
    //var user = await User.findByEmail(userEmail);
    //console.log(user);

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    
    res.render('portal/index', 
    { 
        restaurant: restaurant,
        restaurantUrl: restaurantUrl
    });
}

exports.getRestaurantOrdersAccept = async (req, res, next) => {
    console.log('\ngetPortal-Orders-Accept Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllUnconfirmed(restaurantUrl);

    res.render('portal/orders-accept', 
    { 
        orders: orders
    });
}

exports.getRestaurantOrdersCompleted = async (req, res, next) => {
    console.log('\ngetPortalOrdersCompleted Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllCompleted(restaurantUrl);

    res.render('portal/orders-completed', 
    {
        orders: orders
    });
}

exports.getRestaurantOrdersDeclined = async (req, res, next) => {
    console.log('\ngetPortalOrdersDeclined Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllDeclined(restaurantUrl);

    res.render('portal/orders-declined', 
    {
        orders: orders
    });
}

exports.getRestaurantOrdersChef = async (req, res, next) => {
    console.log('\ngetPortalOrdersChef Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllConfirmed(restaurantUrl);

    res.render('portal/orders-chef', 
    { 
        orders: orders
    });
}

exports.getRestaurantMenuShow = async (req, res, next) => {
    console.log('\ngetPortalMenuShow Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var restaurant = await Restaurant.findByUrl(restaurantUrl);

    if(restaurant != null)
    {   
        res.render('portal/menu-show', {
            admin: false,
            loggedIn: null,
            IsOpen: restaurant.open,
            restaurant: restaurant,
            restaurantImage: "",
            restaurantUrl: restaurantUrl,
            path: '/restaurants'
        });
    }
    else
    {
        res.redirect('/error');
    }
    
}

exports.getRestaurantMenuEdit = async (req, res, next) => {
    console.log('\ngetPortalMenuEdit Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    //console.log(restaurant);

    res.render('portal/menu-edit', 
    { 
        restaurant: restaurant
    });
}

exports.getRestaurantStats = async (req, res, next) => {
    console.log('\ngetPortalStats Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllByRestaurantUrl(restaurantUrl);

    res.render('portal/statistics', 
    {
        orders: orders
    });
}

exports.getRestaurantReviews = async (req, res, next) => {
    console.log('\ngetPortalReviews Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var reviews = await Review.fetchAllByRestaurantUrl(restaurantUrl);

    res.render('portal/reviews', 
    { 
        reviews: reviews
    });
}

exports.getRestaurantSettings = async (req, res, next) => {
    console.log('\ngetPortalSettings Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    var user = await User.findByCookieIdReturnUserObject(cookieId);

    //logged in user
    if(user != null)
    {
        res.render('portal/settings', 
        {
            user: user,
            restaurant: restaurant,

            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone
        });
    }

    else
    {
        res.redirect('/error');
    }
}

exports.getRestaurantLogout = async (req, res, next) => {
    console.log('\ngetPortalLogout Test');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    console.log('postLogout >');
    //res.setHeader('Set-Cookie', 'loginCookie=');  
    let logoutSuccessful = 1;
    let logoutFailed = 0;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    

    User.logout(loginCookie).then(result => {
        if(result == logoutSuccessful)
        {
            res.setHeader('Set-Cookie', 'loginCookie='); 
            console.log('logout succesful')
            res.redirect('/');
        }
                        
        else
        {
            res.redirect('/portal');
        }

    })
    

}

exports.postRestaurantUpdateMenu = async (req, res, next) => {
    console.log('getTest postRestaurantUpdateMenu');
    console.log(req.body);
    console.log(res.locals.userEmail);

    var owner = res.locals.userEmail;
    var img = JSON.parse(req.body.inputAllImg);
    var phone = JSON.parse(req.body.inputAllPhone);
    var address = JSON.parse(req.body.inputAllAddress);
    var description = JSON.parse(req.body.inputAllDescription);
    var hours = JSON.parse(req.body.inputAllHours);
    var types = JSON.parse(req.body.inputAllTypes);
    var categories = JSON.parse(req.body.inputAllCategories);
    var items = JSON.parse(req.body.inputAllItems);
    
    var updateRestaurant = await Restaurant.updateMenu(
        owner,
        hours,
        description,
        img,
        categories,
        items,
        phone,
        address,
        types
    );

    res.redirect("/portal/menu/show");

    /*console.log("*** categories (" + categories.length + ") ***");
    console.log(categories);
    console.log("*** items (" + items.length + ") ***");
    console.log(items);
    console.log("*** img ***");
    console.log(img);
    console.log("*** hours ***");
    console.log(hours);
    console.log("*** description ***");
    console.log(description);*/


    //if successful redirect
    //res.redirect("/portal/menu-edit");
}

exports.postRestaurantMenuListed = async (req, res, next) => {
    console.log('getTest postRestaurantMenuListed');
    console.log(req.body);
    console.log(res.locals.userEmail);

    var owner = res.locals.userEmail;
    var value = req.body.menuListed;
    
    if(value == "true")
    {
        value = true;
    }

    else if(value == "false")
    {
        value = false;
    }

    var updateRestaurant = await Restaurant.menuListed(owner, value);

    res.redirect('/portal/settings');
}

exports.postRestaurantMenuOnline = async (req, res, next) => {
    console.log('getTest postRestaurantMenuOnline');
    console.log(req.body);
    console.log(res.locals.userEmail);

    var owner = res.locals.userEmail;
    value = req.body.menuOnline;
        
    if(value == "true")
    {
        value = true;
    }

    else if(value == "false")
    {
        value = false;
    }

    var updateRestaurant = await Restaurant.menuOnline(owner, value);

    res.redirect('/portal/settings');
}

//tests
exports.getTest = async (req, res, next) => {
    console.log('getTest');

    res.render('shop/test.ejs', 
    { 

    });
}

exports.postRestaurantReview = async (req, res, next) => {
    console.log('getTest postRestaurantReview');
    console.log(req.body);
    console.log(res.locals.userEmail);

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
    console.log(checkIfOrderReviewExist);

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

exports.getGoogleMapsApiTest = async (req, res, next) => {
    console.log('getTest');
    console.log(req.body);
    console.log(res.locals.userEmail);

    res.render('shop/googleMapsApi.ejs', 
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

    res.redirect('/temp');
}