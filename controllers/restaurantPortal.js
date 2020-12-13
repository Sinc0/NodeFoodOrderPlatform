const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Order = require('../models/order');
const Review = require('../models/review');



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

//portal restaurant
exports.getRestaurantIndex = async (req, res, next) => {
    console.log('\ngetRetaurantPortalIndex');
    
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    
    res.render('restaurantPortal/index', 
    { 
        restaurant: restaurant,
        restaurantUrl: restaurantUrl
    });
}

exports.getRestaurantOrdersAccept = async (req, res, next) => {
    console.log('\ngetRestaurantPortalOrdersAccept');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    var orders = await Order.fetchAllUnconfirmed(restaurantUrl);

    res.render('restaurantPortal/orders-accept', 
    { 
        restaurant: restaurant,
        orders: orders
    });
}

exports.getRestaurantOrdersCompleted = async (req, res, next) => {
    console.log('\ngetRestaurantPortalOrdersCompleted');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllCompleted(restaurantUrl);

    res.render('restaurantPortal/orders-completed', 
    {
        orders: orders
    });
}

exports.getRestaurantOrdersDeclined = async (req, res, next) => {
    console.log('\ngetRestaurantPortalOrdersDeclined');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllDeclined(restaurantUrl);

    res.render('restaurantPortal/orders-declined', 
    {
        orders: orders
    });
}

exports.getRestaurantOrdersChef = async (req, res, next) => {
    console.log('\ngetRestaurantPortalOrdersChef');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllConfirmed(restaurantUrl);

    res.render('restaurantPortal/orders-chef', 
    { 
        orders: orders
    });
}

exports.getRestaurantMenuShow = async (req, res, next) => {
    console.log('\ngetRestaurantPortalMenuShow');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var restaurant = await Restaurant.findByUrl(restaurantUrl);

    if(restaurant != null)
    {   
        res.render('restaurantPortal/menu-show', {
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
    console.log('\ngetRestaurantPortalMenuEdit');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var restaurant = await Restaurant.findByUrl(restaurantUrl);

    res.render('restaurantPortal/menu-edit', 
    { 
        restaurant: restaurant
    });
}

exports.getRestaurantStats = async (req, res, next) => {
    console.log('\ngetRestaurantPortalStats');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var orders = await Order.fetchAllCompleted(restaurantUrl);

    res.render('restaurantPortal/statistics', 
    {
        orders: orders
    });
}

exports.getRestaurantReviews = async (req, res, next) => {
    console.log('\ngetRestaurantPortalReviews');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

    var reviews = await Review.fetchAllByRestaurantUrl(restaurantUrl);

    res.render('restaurantPortal/reviews', 
    { 
        reviews: reviews
    });
}

exports.getRestaurantSettings = async (req, res, next) => {
    console.log('\ngetRestaurantPortalSettings');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);

    var restaurant = await Restaurant.findByUrl(restaurantUrl);
    var user = await User.findByCookieIdReturnUserObject(cookieId);

    //logged in user
    if(user != null)
    {
        res.render('restaurantPortal/settings', 
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
    console.log('\ngetRestaurantPortalLogout');
    console.log('postLogout >');
    var userEmail = res.locals.userEmail;
    var restaurantUrl = res.locals.restaurantUrl;

 
    let logoutSuccessful = 1;
    let logoutFailed = 0;
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    

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
    console.log('postRestaurantPortalUpdateMenu');

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

    res.redirect("/restaurantPortal/menu/edit");
}

exports.postRestaurantMenuListed = async (req, res, next) => {
    console.log('postRestaurantPortalMenuListed');
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

    res.redirect('/restaurantPortal/settings');
}

exports.postRestaurantMenuOnline = async (req, res, next) => {
    console.log('postRestaurantPortalMenuOnline');

    var owner = res.locals.userEmail;
    var value = req.body.menuOnline;
        
    if(value == "true")
    {
        value = true;
    }

    else if(value == "false")
    {
        value = false;
    }

    var updateRestaurant = await Restaurant.menuOnline(owner, value);

    res.redirect('/restaurantPortal/settings');
}

exports.postRestaurantWelcomeMessage = async (req, res, next) => {
    console.log('postRestaurantPortalWelcomeMessage');

    var owner = res.locals.userEmail;
    var value = req.body.welcomeMessage;
    var page = req.body.page;
        
    if(value == "true")
    {
        value = true;
    }

    else if(value == "false")
    {
        value = false;
    }

    var updateRestaurant = await Restaurant.welcomeMessage(owner, value);

    if(page == 'home')
    {
        res.redirect('/restaurantPortal');
    }

    else
    {
        res.redirect('/restaurantPortal/settings');
    }

}


exports.postOrderUpdate = async (req, res, next) => {
    console.log('\npostOrderUpdate');

    orderId = req.body.orderId;
    status = req.body.status;
    estimatedCompletionTime = req.body.estimatedTime;

    var order = await Order.updateOne(orderId, status, estimatedCompletionTime);

    res.redirect('back');
}
