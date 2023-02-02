//imports
const User = require('./models/user');
const Restaurant = require('./models/restaurant');

//functions
function parseLoginCookie(cookieId)
{
    let findLoginCookie = cookieId;
    let regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g;
    let loginCookieId = null
    //let regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g;
    //let loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail);

    if(findLoginCookie == null || findLoginCookie == 'loginCookie=') { return null }
    if(regexFindLoginCookieId == null) { return null }

    loginCookieId = findLoginCookie.match(regexFindLoginCookieId);
    cookieId = parseFloat(loginCookieId); 

    if(cookieId != null) { return cookieId }
    else { return null }
}

module.exports = (req, res, next) => {
    //variables
    let loginCookie = req.get('Cookie');
    let cookieId = parseLoginCookie(loginCookie);

    if(cookieId == null) //user is anon
    {
        res.locals.validation = false;
        process.stdout.write("\n" + "anon > ")
        next();
    }
    else //user is signed in
    {
        User
            .validateLogin(cookieId)
            .then(validation => {
                res.locals.validation = validation;
                res.locals.userEmail = validation.userEmail;
                
                if(validation.status == true)
                {
                    //user is admin
                    if(validation.isAdmin == true) { next() }

                    //user is restaurant
                    else if(validation.status == true)
                    {
                        Restaurant
                                .findByEmail(res.locals.userEmail)
                                .then(restaurantCheck => {
                                    if(restaurantCheck != null) { 
                                        res.locals.restaurantUrl = restaurantCheck.url;
                                        next() 
                                    }
                                    else
                                    {
                                        next();
                                    }
                                })
                    }
                }

                //error
                else
                {
                    next();
                }
        })
        .catch(err => {console.log(err)})
    }
}
