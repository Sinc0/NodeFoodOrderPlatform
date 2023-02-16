//imports
const Restaurant = require('../models/restaurant')
const User = require('../models/user')
const Order = require('../models/order')
const Review = require('../models/review')


//get
exports.getHome = (req, res) => {
    //log
    process.stdout.write('admin > home')

    //variables
    let validation = res.locals.validation
    
    //render page
    if(validation.status == true && validation.isAdmin == true) //user is admin
    {
        Admin
            .fetchAllPosts()
            .then(adminPosts => {
                res.render('admin-home.ejs', { 
                    admin: validation.isAdmin,
                    loggedIn: true,
                    path: '/home',
                    adminPosts: adminPosts
                })
            })
            .catch(err => console.log(err))
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.getOrders = (req, res, next) => {
    //log
    process.stdout.write('admin > orders')

    //variables
    let validation = res.locals.validation
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Order
            .fetchAll()
            .then(orders => {
                res.render('admin-orders.ejs', { 
                    admin: validation.isAdmin,
                    loggedIn: true,
                    orders: orders,
                    path: '/orders',
                    pageTitle: 'Order List'
                })
            })
            .catch(err => console.log(err))
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.getRestaurants = (req, res, next) => {
    //log
    process.stdout.write('admin > restaurants')

    //variables
    let validation = res.locals.validation

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Restaurant
                .fetchAll()
                .then(restaurants => {
                    res.render('admin-restaurants.ejs', { 
                        admin: validation.isAdmin,
                        loggedIn: true,
                        restaurants: restaurants,
                        path: '/restaurants',
                        pageTitle: 'Admin Restaurants'
                    })
                })
                .catch(err => console.log(err))
    }
    else //anon user
    {
        res.redirect('/')
    }
}


exports.getUsers = (req, res, next) => {
    //log
    process.stdout.write('admin > users')

    //variables
    let validation = res.locals.validation
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        User
            .fetchAll()
            .then(users => {
                res.render('admin-users.ejs', { 
                    admin: validation.isAdmin,
                    loggedIn: true,
                    users: users,
                    path: '/users',
                    pageTitle: 'Admin Users'
                })
            })
            .catch(err => console.log(err))
    }
    else  //anon user
    {
        res.redirect('/')
    }
}


exports.getReviews = (req, res, next) => {
    //log
    process.stdout.write('admin > reviews')

    //variables
    let validation = res.locals.validation

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Review
            .fetchAll()
            .then(reviews => {
                res.render('admin-reviews.ejs', { 
                    admin: validation.isAdmin,
                    loggedIn: true,
                    reviews: reviews,
                    path: '/reviews',
                    pageTitle: 'Admin Reviews'
                })
            })
            .catch(err => console.log(err))
    }
    else //anon user
    {
        res.redirect('/')
    }
}


exports.getStats = async (req, res, next) => {
    //log
    process.stdout.write('admin > statistics')

    //variables    
    let validation = res.locals.validation
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        let orders = await Order.fetchAll()
        let restaurants = await Restaurant.fetchAll()
        let users = await User.fetchAll()
        let reviews = await Review.fetchAll()

        res.render('admin-stats.ejs', { 
            admin: validation.isAdmin,
            loggedIn: true,
            orders: orders,
            restaurants: restaurants,
            users: users,
            reviews: reviews,
            path: '/stats',
            pageTitle: 'Admin Stats'
        })
    }
    else //anon user
    {
        res.redirect('/')
    }
}


//post
exports.postEditOrder = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > edit-order')

    //variables
    let validation = res.locals.validation
    let orderId = req.body.id
    let date = req.body.date
    let user = req.body.user
    let status = req.body.status
    let restaurant = req.body.restaurant
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        //update db
        await Order.updateAdmin(orderId, date, user, status, restaurant)

        //render page
        res.redirect('/admin/orders')
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.postEditRestaurant = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > edit-restaurant')

    //variables
    let validation = res.locals.validation
    let restaurantId = req.body.id
    let title = req.body.title
    let email = req.body.email
    let owner = req.body.owner
    let address = req.body.address
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        //update db
        await Restaurant.updateAdmin(restaurantId, title, email, owner, address)

        //render page
        res.redirect('/admin/restaurants')
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.postEditUser = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > edit-user')
    
    //variables
    let validation = res.locals.validation
    let userId = req.body.id
    let name = req.body.name
    let address = req.body.address
    let phone = req.body.phone
    let isLoggedIn = req.body.isLoggedIn
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        //update db
        await User.updateAdmin(userId, name, address, phone, isLoggedIn)

        //render page
        res.redirect('/admin/users')
    }
    else //anon user
    {
        res.redirect('/')
    }
}


exports.postEditReview = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > edit-review')

    //variables
    let validation = res.locals.validation
    let reviewId = req.body.id
    let date = req.body.date
    let restaurant = req.body.restaurant
    let rating = req.body.rating
    let user = req.body.user
    let items = req.body.items
    let comment = req.body.comment
    let name = req.body.name
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        //update db
        await Review.updateAdmin(reviewId, date, restaurant, rating, user, items, comment, name)

        //render page
        res.redirect('/admin/reviews')
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.postDeleteRestaurant = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > delete-restaurant')

    //variables
    let validation = res.locals.validation
    let restaurantId = req.body.restaurantId
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {

        //update db
        await Restaurant.deleteOne(restaurantId)

        //render page
        res.redirect('/admin/restaurants')
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.postDeleteUser = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > delete-user')

    //variables
    let validation = res.locals.validation
    let user = req.body.email
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        //update db
        await User.deleteOne(user)

        //render page
        res.redirect('/admin/users')
    }
    else //anon user 
    {
        res.redirect('/')
    }
}


exports.postDeleteReview = async (req, res, next) => {
    //log
    process.stdout.write('admin > post > delete-review')

    //variables
    let validation = res.locals.validation
    let reviewId = req.body.id
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        //update db
        await Review.deleteOne(reviewId)

        //render page
        res.redirect('/admin/reviews')
    }
    else
    {
        res.redirect('/') 
    }
}