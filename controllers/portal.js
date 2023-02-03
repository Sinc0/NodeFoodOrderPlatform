//imports
const Restaurant = require('../models/restaurant')
const User = require('../models/user')
const Order = require('../models/order')
const Review = require('../models/review')


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


//get
exports.getRestaurantIndex = async (req, res, next) => {
    //log
    process.stdout.write('portal > index')
    
    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let restaurant = await Restaurant.findByUrl(restaurantUrl)
    
    //render page
    res.render('portal-index.ejs', { 
        restaurant: restaurant,
        restaurantUrl: restaurantUrl
    })
}


exports.getRestaurantOrdersAccept = async (req, res, next) => { process.stdout.write('portal > accept-orders') }


exports.getRestaurantOrdersCompleted = async (req, res, next) => { process.stdout.write('portal > completed-orders') }


exports.getRestaurantOrdersChef = async (req, res, next) => { process.stdout.write('portal > cook-orders') }


exports.getRestaurantOrdersHistory = async (req, res, next) => {
    //log
    process.stdout.write('portal > orders')
    
    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let restaurant = await Restaurant.findByUrl(restaurantUrl)
    let ordersAccept = await Order.fetchAllUnconfirmed(restaurantUrl)
    let ordersCook = await Order.fetchAllConfirmed(restaurantUrl)
    let ordersCompleted = await Order.fetchAllCompleted(restaurantUrl)
    let ordersDeclined = await Order.fetchAllDeclined(restaurantUrl)

    //render page
    res.render('portal-orders-history.ejs', {
        ordersAccept: ordersAccept,
        ordersCook: ordersCook,
        ordersCompleted: ordersCompleted,
        ordersDeclined: ordersDeclined,
        restaurant: restaurant
    })
}


exports.getRestaurantMenuEdit = async (req, res, next) => {
    //log
    process.stdout.write('portal > edit-menu')
    
    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let restaurant = await Restaurant.findByUrl(restaurantUrl)

    //render page
    res.render('portal-menu-edit.ejs', { 
        restaurant: restaurant
    })
}


exports.getRestaurantStats = async (req, res, next) => {
    //log
    process.stdout.write('portal > statistics')

    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let orders = await Order.fetchAllCompleted(restaurantUrl)
    let restaurant = await Restaurant.findByUrl(restaurantUrl)
    var reviews = await Review.fetchAllByRestaurantUrl(restaurantUrl)

    //render page
    res.render('portal-statistics.ejs', {
        orders: orders,
        restaurant: restaurant,
        reviews: reviews
    })
}


exports.getRestaurantReviews = async (req, res, next) => {
    //log
    process.stdout.write('portal > reviews')

    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let reviews = await Review.fetchAllByRestaurantUrl(restaurantUrl)

    //render page
    res.render('portal-reviews.ejs', { 
        reviews: reviews
    })
}


exports.getRestaurantSettings = async (req, res, next) => {
    //log
    process.stdout.write('portal > settings')

    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    let restaurant = await Restaurant.findByUrl(restaurantUrl)
    let user = await User.findByCookieIdReturnUserObject(cookieId)

    //render page
    if(user != null) //logged in user
    {
        res.render('portal-settings.ejs', {
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
        res.redirect('/error')
    }
}


exports.getRestaurantLogout = async (req, res, next) => {
    //log
    process.stdout.write('portal > logout > ')

    //variables
    let userEmail = res.locals.userEmail
    let restaurantUrl = res.locals.restaurantUrl
    let logoutSuccessful = 1
    let logoutFailed = 0
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)
    
    //render page
    User.logout(loginCookie).then(result => {
        if(result == logoutSuccessful)
        {
            res.setHeader('Set-Cookie', 'loginCookie="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/')
            res.redirect('/')
        }   
        else
        {
            res.redirect('/portal')
        }

    })
}


//post
exports.postRestaurantUpdateMenu = async (req, res, next) => {
    //log
    process.stdout.write('portal > post > update-menu')

    //variables
    let owner = res.locals.userEmail
    let img = req.body.inputAllImg.replaceAll('"', "").replaceAll('\\', "")
    let phone = req.body.inputAllPhone.replaceAll('"', "").replaceAll('\\', "")
    let address = req.body.inputAllAddress.replaceAll('"', "").replaceAll('\\', "")
    let description = req.body.inputAllDescription.replaceAll('"', "").replaceAll('\\', "")
    let city = req.body.inputAllCity.replaceAll('"', "").replaceAll('\\', "")
    let types = req.body.inputAllTypes.replaceAll('"', "").replaceAll('\\', "")
    let hours = JSON.parse(req.body.inputAllHours)
    let categories = JSON.parse(req.body.inputAllCategories)
    let items = JSON.parse(req.body.inputAllItems)
    
    //update db
    await Restaurant.updateMenu(owner, hours, description, img, categories, items, phone, address, types, city)

    //refresh page
    res.redirect("/portal/menu/edit")
}


exports.postRestaurantMenuListed = async (req, res, next) => {
    //log
    process.stdout.write('portal > post > menu-listed')

    //variables
    let owner = res.locals.userEmail
    let value = req.body.menuListed
    
    
    //set value
    if(value == "true") { value = true }
    else if(value == "false") { value = false }

    //update db
    await Restaurant.menuListed(owner, value)

    //render page
    res.redirect('/portal/settings')
}


exports.postRestaurantMenuOnline = async (req, res, next) => {
    //log
    process.stdout.write('portal > post > menu-online')

    //variables
    let owner = res.locals.userEmail
    let value = req.body.menuOnline
    
    //set value
    if(value == "true") { value = true }
    else if(value == "false") { value = false }

    //update db
    await Restaurant.menuOnline(owner, value)

    //render page
    res.redirect('/portal/settings')
}


exports.postRestaurantWelcomeMessage = async (req, res, next) => {
    //log
    process.stdout.write('portal > post > welcome-message')

    //variables
    let owner = res.locals.userEmail
    let value = req.body.welcomeMessage
    let page = req.body.page
        
    //check value
    if(value == "true") { value = true }
    else if(value == "false") { value = false }

    //update db
    await Restaurant.welcomeMessage(owner, value)

    //render page
    if(page == 'home') { res.redirect('/portal') }
    else { res.redirect('/portal/settings') }
}


exports.postOrderUpdate = async (req, res, next) => {
    //log
    process.stdout.write('post > order-update')

    //variables
    orderId = req.body.orderId
    status = req.body.status
    estimatedCompletionTime = req.body.estimatedTime

    //update db
    await Order.updateOne(orderId, status, estimatedCompletionTime)

    //render page
    res.redirect('back')
}
