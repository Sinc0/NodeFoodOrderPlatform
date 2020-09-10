const Restaurant = require('../models/restaurant');
const Cart = require('../models/cart');
const User = require('../models/user');
const Session = require('../models/session');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
const mongodb = require('mongodb');
const stripe = require('stripe')('sk_test_51HEENaLFUjzCbJftCmqLgpLjLGgjY1OOI81cAAzEBmozVIetOISREohGCuuJq55KX3FGhFHvx9FENcU2zRdrIGmn00wIaynLwu');


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

exports.getRestaurantDetail = (req, res, next) => {
    console.log('getRestaurantDetail');
    const restaurantUrl = req.params.restaurantUrl;
    //console.log('ProdId: ' + String(req.params.restaurantId));
    let validation = res.locals.validation;

    //logged in user
    if(validation.status == true)
    {
        Restaurant
        .findByUrl(restaurantUrl)
        .then(restaurant => {
            if(restaurant != null)
            {   
                res.render('shop/restaurant-detail', {
                    admin: validation.isAdmin,
                    loggedIn: true,
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
        })
        .catch(err => console.log(err));
    }

    //anonymous user
    else
    {
        res.redirect('/');
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

    console.log('getIndex');
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

exports.getRestaurantList = (req, res, next) => {
    console.log('getRestaurantList');
    let validation = res.locals.validation;
    let userEmail = res.locals.userEmail;
    const restaurantUrl = req.params.restaurantUrl;
    console.log(restaurantUrl);
    let addToCartSuccessful = 1;
    let addoCartFailed = 0;    

    //console.log(restaurantId);
    //console.log(userEmail);
    
    //logged in user
    if(validation.status == true)
    {
        Restaurant.fetchAll()
        .then(restaurants => 
        {
            res.render('shop/shop-restaurant-list', {
                admin: validation.isAdmin,
                loggedIn: true,
                restaurantImage: "",
                restaurants: restaurants,
                path: '/restaurants'
            });
        }).catch(err => {console.log(err)});
    }

    //anon user
    else
    {
        res.redirect('/');
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
            res.redirect("/order-details/" + orderId);
            
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
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

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

exports.postLogin = (req, res, next) => {
    console.log('\npostLogin >');
    const email = req.body.email;
    const password = req.body.password;
    
    User.login(email, password).then(result=> {
        //console.log("result: " + result);

        if(result.statusText == 'login successful')
        {
            console.log('login user: ' + result.email + ' successful');
            //console.log(result.statusText);
            //console.log(result.cookieId);

            res.setHeader('Set-Cookie', 'loginCookie=' + 'id:' + result.cookieId + 'email:' + result.email + ';')
            res.redirect('/');
           
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
    estimatedCompletionTime = req.body.estimatedTime + " min";

    var order = await Order.updateOne(orderId, status, estimatedCompletionTime);

    res.redirect('/orders-unconfirmed');
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