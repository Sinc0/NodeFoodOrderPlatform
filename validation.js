//imports
const User = require('./models/user')
const Restaurant = require('./models/restaurant')


//functions
function parseLoginCookie(cookieId)
{
    //variables
    let findLoginCookie = cookieId
    let regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g
    let loginCookieId = findLoginCookie.match(regexFindLoginCookieId)
    //let regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g
    //let loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail)

    //null check
    if(findLoginCookie == null || findLoginCookie == 'loginCookie=') { return null }
    if(regexFindLoginCookieId == null) { return null }
    
    //set cookieId
    cookieId = parseFloat(loginCookieId)

    //null check
    if(cookieId != null) { return cookieId }
    else { return null }
}

//exports
module.exports = (req, res, next) => {
    //variables
    let loginCookie = req.get('Cookie')
    let cookieId = parseLoginCookie(loginCookie)

    //user is anon
    if(cookieId == null) 
    {
        process.stdout.write("\n" + "anon > ")
        res.locals.validation = false
        next()
    }

    //user is signed ins
    else 
    {
        User
            .validateLogin(cookieId)
            .then(validation => {
                res.locals.validation = validation
                res.locals.userEmail = validation.userEmail
                
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
                                    if(restaurantCheck != null) { res.locals.restaurantUrl = restaurantCheck.url; next() }
                                    else { next() }
                                })
                    }
                }
                else //error
                {
                    next()
                }
        })
        .catch(err => {console.log(err)})
    }
}
