//imports
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Order = require('../models/order');
const Review = require('../models/review');
const Admin = require('../models/admin');


//get
exports.getHome = (req, res) => {
    //debugging
    console.log('admin-home.ejs');

    //variables
    let validation = res.locals.validation;
    
    //render page
    if(validation.status == true && validation.isAdmin == true) //user is admin
    {
        Admin.fetchAllPosts()
        .then(adminPosts => {
            res.render('admin-home.ejs', { 
                admin: validation.isAdmin,
                loggedIn: true,
                path: '/home',
                adminPosts: adminPosts
            })
        })
        .catch(err => console.log(err));
    }
    else //anon user 
    {
        res.redirect('/');
    }
}

exports.getOrders = (req, res, next) => {
    console.log('admin-orders.ejs');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Order.fetchAll()
        .then(orders => {
            res.render('admin-orders.ejs', { 
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
    console.log('admin-restaurants.ejs');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Restaurant.fetchAll()
        .then(restaurants => {
            res.render('admin-restaurants.ejs', { 
                admin: validation.isAdmin,
                loggedIn: true,
                restaurants: restaurants,
                path: '/restaurants',
                pageTitle: 'Admin Restaurants'
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

exports.getUsers = (req, res, next) => {
    
    console.log('admin-users.ejs');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        User.fetchAll()
        .then(users => {
            res.render('admin-users.ejs', { 
                admin: validation.isAdmin,
                loggedIn: true,
                users: users,
                path: '/users',
                pageTitle: 'Admin Users'
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

exports.getReviews = (req, res, next) => {
    console.log('admin-reviews.ejs');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Review.fetchAll()
        .then(reviews => {
            res.render('admin-reviews.ejs', { 
                admin: validation.isAdmin,
                loggedIn: true,
                reviews: reviews,
                path: '/reviews',
                pageTitle: 'Admin Reviews'
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

exports.getStats = async (req, res, next) => {
    
    console.log('admin-stats.ejs');
    let validation = res.locals.validation;

    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var orders = await Order.fetchAll();
        var restaurants = await Restaurant.fetchAll();
        var users = await User.fetchAll();
        var reviews = await Review.fetchAll();

        res.render('admin-stats.ejs', { 
            admin: validation.isAdmin,
            loggedIn: true,
            orders: orders,
            restaurants: restaurants,
            users: users,
            reviews: reviews,
            path: '/stats',
            pageTitle: 'Admin Stats'
        });
    }

    //anon user
    else
    {
        res.redirect('/');
    }

}


//post
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

    var restaurantId = req.body.id;
    var title = req.body.title;
    var email = req.body.email;
    var owner = req.body.owner;
    var address = req.body.address;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        var updateRestaurant = await Restaurant.updateAdmin(restaurantId, title, email, owner, address);
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

exports.postNewsPost = async (req, res, next) => {
    console.log('postNewsPost');
    let validation = res.locals.validation;

    var type = req.body.type;
    var postId = req.body.postId;
    var date = req.body.date;
    var title = req.body.title;
    var text = req.body.text;

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