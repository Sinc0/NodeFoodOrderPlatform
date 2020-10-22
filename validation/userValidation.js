const User = require('../models/user');
const Restaurant = require('../models/restaurant');

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

module.exports = (req, res, next) => {

    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);
    
    //first time user
    if(cookieId == null)
    {
        console.log('\nanon user >');

        res.locals.validation = false;
        next();
    }

    else
    {
        User.validateLogin(cookieId)
        .then(validation => {
            if(validation.status == true && validation.isAdmin == true)
            {
                res.locals.validation = validation;
                res.locals.userEmail = validation.userEmail;
                //res.locals.text = 'admin'
                next();
            }
    
            else if(validation.status == true)
            {
                res.locals.validation = validation;
                res.locals.userEmail = validation.userEmail;
                
                Restaurant.findByEmail(res.locals.userEmail).then(restaurantCheck => {
                    console.log(restaurantCheck);
                    
                    if(restaurantCheck != null)
                    {
                        res.redirect('/portal');
                    }

                    else
                    {
                        //res.locals.text = 'logged in user';
                        next();
                    }
                })

            }
            
            else
            {
                res.locals.validation = validation;
                //res.locals.text = 'anon';
                next();
            }
        })
        .catch(err => {console.log(err)})
    }
    
}
