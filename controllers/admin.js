const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const mongodb = require('mongodb');
const fs = require('fs');
const Order = require('../models/order');
const path = require('path');
const Review = require('../models/review');
const Admin = require('../models/admin');

const ObjectId = mongodb.ObjectId;

function deleteFile(filePath)
{
    fs.unlink(filePath, (err) => {
        if(err)
        {
            throw(err);
        }
    });
}

function parseLoginCookie(cookieId)
{
    var findLoginCookie = cookieId;

    if(findLoginCookie == null)
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

//old
/* exports.addRestaurant = (req, res, next) => {
    //console.log('In the middleware');
    //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));

    console.log('getAdminAddRestaurants');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        res.render('admin/add-restaurant', { 
            pageTitle: 'Add Restaurant',
            path: 'admin/add-restaurant',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            statusText: "Image max size: 5MB"
        });
    }

    else
    {
        res.redirect('/');
    }

} */

/* exports.postRestaurant =  (req, res, next) => {

    console.log('postAddAdminRestaurant >');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        const id = req.body.id;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const imageUrl = req.file;
        //console.log(imageUrl);
        //console.log(imageUrl.path);
        let imageSize = null;
        let imageSizeLimit = 5000000;

        if(imageUrl != null)
        {
            imageSize = imageUrl.size;
        }
        
        //console.log(imageUrl);

        if(imageSize > imageSizeLimit)
        {
            console.log('add restaurant image: file too large');
            console.log('add restaurant image: failed');
            res.render('admin/add-restaurant', {
                path: '/add-restaurant',
                pageTitle: 'Add Restaurant',
                statusText: 'Error: file to large' 
            })
        }

        else if(!imageUrl) {
            const imagePath = '../images/standardImage.jpg';

            const restaurant = new Restaurant(title, price, description, imagePath);

            restaurant
                .save()
                .then(result => {
                    //console.log(result)
                    console.log('add restaurant: ' + title + ' added sucessfully');
                    //console.log(restaurant);
                    res.redirect('/admin/restaurant-list')
                })
                .catch(err => console.log(err));

            
            //console.log('add product: file type not supported');
            //console.log('add product: failed')
            //res.redirect('/admin/add-product');
            
        }

        else
        {   
            const imagePath = imageUrl.path;

            const restaurant = new Restaurant(title, price, description, imagePath);

            restaurant
                .save()
                .then(result => {
                    //console.log(result)
                    console.log('add restaurant: ' + title + ' added sucessfully');
                    //console.log(product);
                    res.redirect('/admin/restaurant-list')
                })
                .catch(err => console.log(err));
        }

    }

    else
    {
        res.redirect('/');
    }

} */

/* exports.getEditRestaurant = (req, res, next) => {

    console.log('getAdminEditRestaurant');
    const restaurantId = req.params.restaurantId;
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {

        Restaurant
        .findById(restaurantId)
        .then(restaurant => { 
            res.render('admin/edit-restaurant', {
                pageTitle: restaurant.title,
                restaurant: restaurant,
                path: '/edit-restaurant'
            });
        })
        .catch(err => console.log(err));
    }

    else
    {
        res.redirect('/');
    }

    
    //const prodId = req.params.productId;
    //Product
    //.findById(prodId)
    //.then(product => {
        //res.render('shop/product-detail', {
            //product: product,
            //path: '/products'
        //});
    //})
    //.catch(err => console.log(err));
    
} */

/* exports.postEditRestaurant = (req, res, next) => {

    console.log('postEditAdminRestaurant >');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        const restaurantId = req.body.id;
        const updatedTitle = req.body.title;
        const updatedPrice = req.body.price;
        const updatedDescription = req.body.description;
        const updatedImageUrl = req.file;
        const standardImage = "../images/standardImage.jpg";
        let imageCheck = req.body.imageCheck;
        let imageSize = null;
        let imageSizeLimit = 5000000;

        //console.log(updatedImageUrl);
        //console.log(imageCheck);
        //console.log(imageSize);
        
        if(updatedImageUrl != null)
        {
            imageSize = updatedImageUrl.size;
        }
        
        if(imageCheck == null || imageCheck == "")
        {
            imageCheck = null;
        }  
     
        //if image is selected
        if(updatedImageUrl != null && imageSize < imageSizeLimit)
        {
            const updatedImagePath = updatedImageUrl.path;
            
            //const product = new Product(updatedId, updatedTitle, updatedPrice, updatedDescription, updatedImagePath);
    
            Restaurant
                .update(restaurantId, updatedTitle, updatedPrice, updatedDescription, updatedImageUrl.path)
                .then(result => {
                    //console.log(result.title)
                    //console.log('Restaurant Updated')
                    console.log('edit restaurant: ' + restaurantId + ' successful')
                    res.redirect('/admin/restaurant-list')
                })
                .catch(err => console.log(err));
        }

        //if no image is selected and restaurant have image from before
        else if(updatedImageUrl == null && imageCheck != null && imageSize < imageSizeLimit)
        {
            const updatedImagePath = imageCheck;
    
            Restaurant
                .update(restaurantId, updatedTitle, updatedPrice, updatedDescription, updatedImagePath)
                .then(result => {
                    //console.log(result.title)
                    //console.log('Restaurant Updated')
                    console.log('edit restaurant: ' + restaurantId + ' successful')
                    res.redirect('/admin/restaurant-list')
                })
                .catch(err => console.log(err));
        }

        //if no image selected and restaurant have no image from before
        else if(updatedImageUrl == null && imageCheck == null && imageSize < imageSizeLimit) 
        {   
            const updatedImagePath = standardImage;
    
            Restaurant
                .update(restaurantId, updatedTitle, updatedPrice, updatedDescription, updatedImagePath)
                .then(result => {
                    //console.log(result.title)
                    //console.log('Restaurant Updated')
                    console.log('edit restaurant: ' + restaurantId + ' successful')
                    res.redirect('/admin/restaurant-list')
                })
                .catch(err => console.log(err));
        }

        else
        {
            if(imageSize > imageSizeLimit)
            {
                console.log('edit restaurant: image file to large')
                console.log('edit restaurant: failed');
                res.redirect('/admin/edit-restaurant/' + restaurantId);
            }

            else
            {
                console.log('edit restaurant: image file type not supported');
                console.log('edit restaurant: failed');
                res.redirect('/admin/edit-restaurant/' + restaurantId);
            }
        
        }

    }

    else
    {
        res.redirect('/');
    }

} */

/* exports.postDeleteRestaurant = (req, res, next) => {
    
    console.log('postDeleteAdminRestaurant >');
    const restaurantId = req.params.restaurantId;
    let validation = res.locals.validation;
    let restaurantImagePath = null;
    let deleteSuccessful = 1;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Restaurant.findById(restaurantId)
        .then(result => {

            //console.log(result)
            restaurantImagePath = result.imageUrl;

            if(restaurantImagePath.includes('standardImage.jpg') == false)
            {
                fs.unlink(restaurantImagePath, (err) => {
                    if(err)
                    {
                        console.log(err);
                        //console.log('delete restaurant: image file deleted failed');
                        console.log('delete restaurant: ' + restaurantId + ' failed');
                        res.redirect('/admin/restaurant-list');
                    }
    
                    else
                    {
    
                        //console.log('delete restaurant: image file deleted successfully');
                        Restaurant
                        .delete(restaurantId)
                        .then(result => {
                            
                            //console.log(result);
                            //console.log(deleteSuccessful);
                            
                            if(result == deleteSuccessful)
                            {
                                console.log('delete restaurant: ' + restaurantId + ' successful');
                                res.redirect('/admin/restaurant-list');
                            }
                
                            else
                            {
                                console.log('delete restaurant: ' + restaurantId + ' failed');
                                res.redirect('/admin/restaurant-list');
                            }
                            
                        })
                        .catch(err => console.log(err))
                    }
                })
            }

            else
            {
                Restaurant
                .delete(restaurantId)
                .then(result => {
                    
                    //console.log(result);
                    //console.log(deleteSuccessful);
                    
                    if(result == deleteSuccessful)
                    {
                        console.log('delete restaurant: ' + restaurantId + ' successful');
                        res.redirect('/admin/restaurant-list');
                    }
        
                    else
                    {
                        console.log('delete restaurant: ' + restaurantId + ' failed');
                        res.redirect('/admin/restaurant-list');
                    }
                    
                })
                .catch(err => console.log(err))
            }                
        })
        .catch(err => {console.log(err)})
    }

    //anon user
    else
    {
        res.redirect('/');
    }

} */

/* exports.postDeleteOrder = (req, res, next) => {

    console.log('postDeleteOrder >');
    const orderId = req.params.orderId;
    let validation = res.locals.validation;
    let restaurantImagePath = null;
    let deleteSuccessful = 1;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        restaurantImagePath = path.join(__dirname, '..', 'public', 'orderReciepts', '/Reciept=' + orderId + '.pdf');

        fs.unlink(restaurantImagePath, (err) => {
            if(err)
            {
                console.log(err);
                //console.log('delete restaurant: image file deleted failed');
                console.log('delete order: ' + orderId + ' failed');
                res.redirect('/admin/restaurant-list');
            }

            else
            {
                Order.deleteOne(orderId)
                .then(result => {
                            
                    //console.log(result);
                    //console.log(deleteSuccessful);
                    res.redirect('/admin/order-list');

                })
                .catch(err => console.log(err))
            }
        });
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
} */

/* exports.getOrderList = (req, res, next) => {
    console.log('getOrderList');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Order.fetchAll()
        .then(orders => {
            res.render('admin/order-list', { 
                admin: validation.isAdmin,
                loggedIn: true,
                orders: orders,
                path: '/orders',
                pageTitle: 'Order List'
            });
        })
        .catch(err => console.log(err));
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
} */

//get
exports.getHome = (req, res, next) => {
    console.log('getHome');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Admin.fetchAllPosts()
        .then(adminPosts => {
            res.render('admin/home', { 
                admin: validation.isAdmin,
                loggedIn: true,
                path: '/home',
                adminPosts: adminPosts
            });
        })
        .catch(err => console.log(err));
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.getOrders = (req, res, next) => {
    console.log('getOrders');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Order.fetchAll()
        .then(orders => {
            res.render('admin/orders', { 
                admin: validation.isAdmin,
                loggedIn: true,
                orders: orders,
                path: '/orders',
                pageTitle: 'Order List'
            });
        })
        .catch(err => console.log(err));
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.getRestaurants = (req, res, next) => {
    
    console.log('getAdminRestaurantList');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Restaurant.fetchAll()
        .then(restaurants => {
            res.render('admin/restaurants', { 
                admin: validation.isAdmin,
                loggedIn: true,
                restaurants: restaurants,
                path: '/restaurants',
                pageTitle: 'Admin Restaurants'
            });
        })
        .catch(err => console.log(err));
        //console.log('In the middleware');
        //console.log('shop.js', products);
        //res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    }

    else
    {
        res.redirect('/');
    }

}

exports.getUsers = (req, res, next) => {
    
    console.log('getAdminUsers');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        User.fetchAll()
        .then(users => {
            res.render('admin/users', { 
                admin: validation.isAdmin,
                loggedIn: true,
                users: users,
                path: '/users',
                pageTitle: 'Admin Users'
            });
        })
        .catch(err => console.log(err));
        //console.log('In the middleware');
        //console.log('shop.js', products);
        //res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    }
    
    else
    {
        res.redirect('/');
    }
    
}

exports.getReviews = (req, res, next) => {
    
    console.log('getAdminReviews');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Review.fetchAll()
        .then(reviews => {
            res.render('admin/reviews', { 
                admin: validation.isAdmin,
                loggedIn: true,
                reviews: reviews,
                path: '/reviews',
                pageTitle: 'Admin Reviews'
            });
        })
        .catch(err => console.log(err));
        //console.log('In the middleware');
        //console.log('shop.js', products);
        //res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    }

    else
    {
        res.redirect('/');
    }

}

exports.getStats = async (req, res, next) => {
    
    console.log('getAdminReviews');
    let validation = res.locals.validation;
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var orders = await Order.fetchAll();
        var restaurants = await Restaurant.fetchAll();
        var users = await User.fetchAll();
        var reviews = await Review.fetchAll();

        res.render('admin/stats', { 
            admin: validation.isAdmin,
            loggedIn: true,
            orders: orders,
            restaurants: restaurants,
            users: users,
            reviews: reviews,
            path: '/stats',
            pageTitle: 'Admin Stats'
        });

        //console.log('In the middleware');
        //console.log('shop.js', products);
        //res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    }

    else
    {
        res.redirect('/');
    }

}

//edit
exports.postEditOrder = async (req, res, next) => {
    console.log('postEditOrders');
    let validation = res.locals.validation;

    var orderId = req.body.id;
    var date = req.body.date;
    var user = req.body.user;
    var status = req.body.status;
    var restaurant = req.body.restaurant;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var updateOrder = await Order.updateAdmin(orderId, date, user, status, restaurant);

        res.redirect('/admin/orders');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postEditRestaurant = async (req, res, next) => {
    console.log('postEditRestaurants');
    let validation = res.locals.validation;

    console.log(req.body);

    var restaurantId = req.body.id;
    var title = req.body.title;
    var email = req.body.email;
    var owner = req.body.owner;
    var address = req.body.address;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var updateRestaurants = await Restaurant.updateAdmin(restaurantId, title, email, owner, address);

        res.redirect('/admin/restaurants');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postEditUser = async (req, res, next) => {
    console.log('postEditUsers');
    let validation = res.locals.validation;

    var userId = req.body.id;
    var name = req.body.name;
    var address = req.body.address;
    var phone = req.body.phone;
    var isLoggedIn = req.body.isLoggedIn;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var updateUser = await User.updateAdmin(userId, name, address, phone, isLoggedIn);

        res.redirect('/admin/users');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postEditReview = async (req, res, next) => {
    console.log('postEditReviews');
    let validation = res.locals.validation;

    var reviewId = req.body.id;
    var date = req.body.date;
    var restaurant = req.body.restaurant;
    var rating = req.body.rating;
    var user = req.body.user;
    var items = req.body.items;
    var comment = req.body.comment;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var updateReview = await Review.updateAdmin(reviewId, date, restaurant, rating, user, items, comment);

        res.redirect('/admin/reviews');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postEditNewsPost = async (req, res, next) => {
    console.log('postEditNewsPost');
    let validation = res.locals.validation;

    var id = req.body.id;
    var postId = req.body.postId;
    var date = req.body.date;
    var title = req.body.title;
    var text = req.body.text;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var updateReview = await Admin.updateNewsPost(id, postId, date, title, text);

        res.redirect('/admin/home');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

//delete
exports.postDeleteOrder = async (req, res, next) => {
    console.log('postDeleteOrder');
    let validation = res.locals.validation;

    var orderId = req.body.orderId;
    console.log(orderId);
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var deleteOrder = await Order.deleteOne(orderId);

        res.redirect('/admin/orders');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postDeleteRestaurant = async (req, res, next) => {
    console.log('postDeleteRestaurant');
    let validation = res.locals.validation;

    var restaurantId = req.body.restaurantId;
    console.log(restaurantId);
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var deleteRestaurant = await Restaurant.deleteOne(restaurantId);

        res.redirect('/admin/restaurants');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postDeleteUser = async (req, res, next) => {
    console.log('postDeleteUser');
    let validation = res.locals.validation;

    var user = req.body.email;
    console.log(user);
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var deleteUser = await User.deleteOne(user);

        res.redirect('/admin/users');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postDeleteReview = async (req, res, next) => {
    console.log('postDeleteReview');
    let validation = res.locals.validation;

    var reviewId = req.body.id;
    console.log(reviewId);
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var deleteReview = await Review.deleteOne(reviewId);

        res.redirect('/admin/reviews');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.postDeleteNewsPost = async (req, res, next) => {
    console.log('postDeleteNewsPost');
    let validation = res.locals.validation;

    var id = req.body.id;
    console.log(id);
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var deleteAdminPost = await Admin.deleteOne(id);

        res.redirect('/admin/home');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}


//other
exports.postNewsPost = async (req, res, next) => {
    console.log('postNewsPost');
    let validation = res.locals.validation;

    var type = req.body.type;
    var postId = req.body.postId;
    var date = req.body.date;
    var title = req.body.title;
    var text = req.body.text;

    console.log(text);
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var deleteReview = await Admin.createNewsPost(type, postId, date, title, text);

        res.redirect('/admin/home');
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}