const User = require('./models/user');
const Restaurant = require('./models/restaurant');

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

module.exports =  async (req, res, next) => {

    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    
    //anon user
    if(cookieId == null)
    {
        console.log('\nanon user >');

        res.locals.validation = false;
        res.redirect('/');
    }
    else
    {
        //check user validation
        var userCheck = await User.validateLogin(cookieId);
        var validation = userCheck.status;
        var email = userCheck.userEmail;

        if(validation == true)
        {
            res.locals.validation = validation;
            res.locals.userEmail = email;
            
            //check if user have restaurant
            var restaurantCheck = await Restaurant.findByEmail(email);

            //if user have restaurant
            if(restaurantCheck != null)
            {
                res.locals.restaurantUrl = restaurantCheck.url;
                next();
            }

            else
            {
                res.redirect('/');
            }
                            
        }
        else
        {
            res.locals.validation = validation;
            res.redirect('/');
        }
    }
}
