//variables
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Order = require('../models/order');
const Review = require('../models/review');

//functions
function parseLoginCookie(cookieId)
{
    //variables
    let findLoginCookie = cookieId;
    let regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g;
    let loginCookieId = findLoginCookie.match(regexFindLoginCookieId);
    //let regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g;
    //let loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail);

    if(findLoginCookie == null || findLoginCookie == 'loginCookie=') { return null }
    if(regexFindLoginCookieId == null) { return null }
    
    cookieId = parseFloat(loginCookieId);

    if(cookieId != null) { return cookieId }
    else { return null }
}

//exports
exports.getRestaurantIndex = async (req, res, next) => {
    console.log('\ngetRetaurantPortalIndex');
    
    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let restaurant = await Restaurant.findByUrl(restaurantUrl);
    
    //render page
    res.render('restaurantPortal/index', { 
        restaurant: restaurant,
        restaurantUrl: restaurantUrl
    })
}

exports.getRestaurantOrdersAccept = async (req, res, next) => { console.log('\ngetRestaurantPortalOrdersAccept') }
exports.getRestaurantOrdersCompleted = async (req, res, next) => { console.log('\ngetRestaurantPortalOrdersCompleted') }
exports.getRestaurantOrdersChef = async (req, res, next) => { console.log('\ngetRestaurantPortalOrdersChef') }

exports.getRestaurantOrdersHistory = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalOrdersHistory');
    
    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let restaurant = await Restaurant.findByUrl(restaurantUrl);
    let ordersAccept = await Order.fetchAllUnconfirmed(restaurantUrl);
    let ordersCook = await Order.fetchAllConfirmed(restaurantUrl);
    let ordersCompleted = await Order.fetchAllCompleted(restaurantUrl);
    let ordersDeclined = await Order.fetchAllDeclined(restaurantUrl);

    //render page
    res.render('restaurantPortal/orders-history', {
        ordersAccept: ordersAccept,
        ordersCook: ordersCook,
        ordersCompleted: ordersCompleted,
        ordersDeclined: ordersDeclined,
        restaurant: restaurant
    })
}

exports.getRestaurantMenuShow = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalMenuShow');
    
    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let restaurant = await Restaurant.findByUrl(restaurantUrl);

    //render page
    if(restaurant != null) {   
        res.render('restaurantPortal/menu-show', {
            admin: false,
            loggedIn: null,
            IsOpen: restaurant.open,
            restaurant: restaurant,
            restaurantImage: "",
            restaurantUrl: restaurantUrl,
            path: '/restaurants'
        })
    }
    else
    {
        res.redirect('/error');
    }
    
}

exports.getRestaurantMenuEdit = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalMenuEdit');
    
    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let restaurant = await Restaurant.findByUrl(restaurantUrl);

    //render page
    res.render('restaurantPortal/menu-edit', { 
        restaurant: restaurant
    })
}

exports.getRestaurantStats = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalStats')

    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let orders = await Order.fetchAllCompleted(restaurantUrl);
    let restaurant = await Restaurant.findByUrl(restaurantUrl);
    var reviews = await Review.fetchAllByRestaurantUrl(restaurantUrl);

    //render page
    res.render('restaurantPortal/statistics', {
        orders: orders,
        restaurant: restaurant,
        reviews: reviews
    });
}

exports.getRestaurantReviews = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalReviews')

    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let reviews = await Review.fetchAllByRestaurantUrl(restaurantUrl);

    //render page
    res.render('restaurantPortal/reviews', { 
        reviews: reviews
    })
}

exports.getRestaurantSettings = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalSettings')

    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    let restaurant = await Restaurant.findByUrl(restaurantUrl);
    let user = await User.findByCookieIdReturnUserObject(cookieId);

    //render page
    if(user != null) //logged in user
    {
        res.render('restaurantPortal/settings', {
            user: user,
            restaurant: restaurant,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone
        })
    }
    else
    {
        res.redirect('/error');
    }
}

exports.getRestaurantLogout = async (req, res, next) => {
    //debug
    console.log('\ngetRestaurantPortalLogout');
    console.log('postLogout >');

    //variables
    let userEmail = res.locals.userEmail;
    let restaurantUrl = res.locals.restaurantUrl;
    let logoutSuccessful = 1;
    let logoutFailed = 0;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    
    //render page
    User.logout(loginCookie).then(result => {
        if(result == logoutSuccessful)
        {
            console.log('logout succesful')
            res.setHeader('Set-Cookie', 'loginCookie="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/');
            res.redirect('/');
        }   
        else
        {
            res.redirect('/restaurantPortal');
        }

    })
}

exports.postRestaurantUpdateMenu = async (req, res, next) => {
    //debug
    console.log('postRestaurantPortalUpdateMenu')

    //variables
    let owner = res.locals.userEmail;
    let img = JSON.parse(req.body.inputAllImg);
    let phone = JSON.parse(req.body.inputAllPhone);
    let address = JSON.parse(req.body.inputAllAddress);
    let description = JSON.parse(req.body.inputAllDescription);
    let hours = JSON.parse(req.body.inputAllHours);
    let types = JSON.parse(req.body.inputAllTypes);
    let categories = JSON.parse(req.body.inputAllCategories);
    let items = JSON.parse(req.body.inputAllItems);
    
    let updateRestaurant = await Restaurant.updateMenu(
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

    //render page
    res.redirect("/restaurantPortal/menu/edit")
}

exports.postRestaurantMenuListed = async (req, res, next) => {
    //debug
    console.log('postRestaurantPortalMenuListed')
    console.log(req.body);
    console.log(res.locals.userEmail);

    //variables
    let owner = res.locals.userEmail;
    let value = req.body.menuListed;
    
    if(value == "true")
    {
        value = true;
    }
    else if(value == "false")
    {
        value = false;
    }

    let updateRestaurant = await Restaurant.menuListed(owner, value)

    //render page
    res.redirect('/restaurantPortal/settings');
}

exports.postRestaurantMenuOnline = async (req, res, next) => {
    //debug
    console.log('postRestaurantPortalMenuOnline')

    //variables
    let owner = res.locals.userEmail;
    let value = req.body.menuOnline;
        
    if(value == "true")
    {
        value = true;
    }
    else if(value == "false")
    {
        value = false;
    }

    let updateRestaurant = await Restaurant.menuOnline(owner, value);

    //render page
    res.redirect('/restaurantPortal/settings')
}

exports.postRestaurantWelcomeMessage = async (req, res, next) => {
    //debug
    console.log('postRestaurantPortalWelcomeMessage')

    //variables
    let owner = res.locals.userEmail;
    let value = req.body.welcomeMessage;
    let page = req.body.page;
        
    if(value == "true") { value = true }
    else if(value == "false") { value = false }

    let updateRestaurant = await Restaurant.welcomeMessage(owner, value)

    //render page
    if(page == 'home') { res.redirect('/restaurantPortal') }
    else { res.redirect('/restaurantPortal/settings') }
}

exports.postOrderUpdate = async (req, res, next) => {
    //debug
    console.log('\npostOrderUpdate')

    //variables
    orderId = req.body.orderId;
    status = req.body.status;
    estimatedCompletionTime = req.body.estimatedTime

    let order = await Order.updateOne(orderId, status, estimatedCompletionTime)

    //render page
    res.redirect('back')
}
