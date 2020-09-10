const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');
const Session = require('./session');

const ObjectId = mongodb.ObjectId;

class User
{
    constructor(email, name, password, admin, cart, isLoggedIn, loginCookie, orders)
    {
        this.email = email;
        this.name = name;
        this.password = password;
        this.admin = admin;
        this.cart = cart;
        this.isLoggedIn = isLoggedIn;
        this.loginCookie = loginCookie;
        this.orders = orders;
    }
               
    save() 
    {
        const db = getDb();

        return db.collection('users')
            .insertOne(this)
            .then()
            .catch(err => {console.log(err); return "error"});
    }

    static fetchCart(userEmail)
    {
        const db = getDb();

        return db
            .collection('users')
            .find({email: userEmail})
            .next()
            .then(user => {
                if(user != null)
                {
                    //console.log(user.cart); 
                    return user.cart;
                }

                else
                {
                    return null;
                }
            })
            .catch(err => console.log(err))
    }

    static emptyCart(userEmail)
    {
        const db = getDb();

        return db.collection('users')
            .updateOne({email: userEmail}, {$set: 
                {
                    cart: null
                }
            } )
            .then(result => { return result; /* console.log(result) */ })
            .catch(err => console.log(err));
    }

    static addToCart(userEmail, cartArray)
    {
        const db = getDb();

        //const cart = this.cart.items;

        //let cartArray = [{productId: ObjectId(productId), quantity: 10}];

        //const updateCart = cartArray;

        return db.collection('users')
            .updateOne({email: userEmail}, {$set: {cart: cartArray}})
            .then(result => {return result.modifiedCount})
            .catch(err => console.log(err));
    }

    static validateLogin(cookieId)
    {   
        //check if cookie have a session
        return Session.findByCookieId(cookieId)
            .then(result => {

                var cookieFromSessions;
                var cookieFromUsers;

                if(result == null)
                {
                    console.log('login cookie not found');
                    return false;
                }

                else
                {
                    //cookieId = result.loginCookie;
                    //email = result.email;
                    //console.log(cookieId);
                    //console.log(email);
                    //console.log(result.loginCookie);
                    //console.log(result.email);

                    cookieFromSessions = result.loginCookie;

                //check if cookie have a user
                return User.findByEmail(result.email).then(result => 
                    {
                        //console.log(result); 
                        cookieFromUsers = result.loginCookie;
                        //console.log('cookie from sessions: ' + cookieFromSessions);
                        //.log('cookie from users: ' + cookieFromUsers);

                        if(cookieFromSessions == cookieFromUsers)
                        {
                            //console.log('user and sessions cookie is identical');
                            var obj = {status: true, isAdmin: result.admin, userEmail: result.email};
                            return obj;
                            //console.log(result.username);
                            //console.log(result.email);
                            //return true;
                        }

                        else
                        {
                            //console.log('user and sessions cookie is not identical');
                            return false;
                        }
                    });
            }
        })
        
    }

    static deleteOne(email)
    {
        const db = getDb();

        let deleteSuccessful = 1;
        let deleteFailed = 0;

        return db.collection('users')
            .deleteOne({email: email})
            .then(result => {
                if(result.deletedCount == deleteSuccessful)
                {
                    console.log('delete ' + email + ' document successful');
                    return deleteSuccessful;
                } 
                else
                {
                    console.log('delete ' + email + ' document failed');
                    return deleteFailed;
                } })
            .catch(err => console.log(err));
    }

    static updateOne(email, cookieId, isLoggedIn)
    {
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;

        return db.collection('users')
            .updateOne({email: email},         
                {$set: 
                {
                    email: email,
                    loginCookie: cookieId,
                    isLoggedIn: isLoggedIn
                }
            } )
            .then(result => {
                if(result.modifiedCount == updateSuccessful)
                {
                    //console.log('update ' + email + ' document successful');
                    return updateSuccessful;
                } 
                else
                {
                    //console.log('update ' + email + ' document failed');
                    return updateFailed;
                }
            })
            .catch(err => console.log(err));
    }

    static updateCredentials(oldEmail, newEmail, name, address, phone)
    {
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;

        return db.collection('users')
            .updateOne({email: oldEmail},         
                {$set: 
                {
                    email: newEmail,
                    name: name,
                    address: address,
                    phone: phone
                }
            } )
            .then(result => {
                if(result.modifiedCount == updateSuccessful)
                {
                    //console.log('update ' + email + ' document successful');
                    return updateSuccessful;
                } 
                else
                {
                    //console.log('update ' + email + ' document failed');
                    return updateFailed;
                }
            })
            .catch(err => console.log(err));
    }

    static fetchAll()
    {
        const db = getDb();

        return db
            .collection('users')
            .find()
            .toArray()
            .then(users => {console.log(users); return users;})
            .catch(err => console.log(err));
    }

    static findById(userId)
    {
        const db = getDb();

        //check if userId characters are by the rules or else redirect
        
        return db
            .collection('users')
            .findOne({_id: ObjectId(userId)})
            .then(user => {
                console.log(user); 
                return user;
            })
            .catch(err => {console.log(err)})
    }

    static findByCookieId(cookie)
    {
        const db = getDb();

        let u;

        return db
            .collection('users')
            .find({loginCookie: cookie})
            .next()
            .then(user => {
                u = user;
                console.log(user); 
                return cb();
            })
            .catch(err => console.log(err))

        function cb()
        {
            if(u == null)
            {
                return u;
            }

            if(u != null)
            {
                return u.loginCookie;
            }
        }
    }

    static findByCookieIdReturnUserObject(cookie)
    {
        const db = getDb();

        let u;

        return db
            .collection('users')
            .find({loginCookie: cookie})
            .next()
            .then(user => {
                u = user;
                return user;
            })
            .catch(err => console.log(err))
    }
    
    static findByUsername(username)
    {
        const db = getDb();

        return db
            .collection('users')
            .find({username: username})
            .next()
            .then(user => {
                //console.log(user); 
                return user;
            })
            .catch(err => console.log(err))
    }

    static findByEmail(email)
    {
        const db = getDb();

        return db
            .collection('users')
            .find({email: email})
            .next()
            .then(user => {
                //console.log(user); 
                return user;
            })
            .catch(err => console.log(err))
    }
    
    static login(email, password)
    {
        const db = getDb();

        let statusText = '';

        return db.collection('users')
        .find({email: email})
        .next()
        .then(result => {
            if(result == null)
            {
                //console.log(result);
                //console.log('email is invalid');
                statusText = 'email is invalid';
                return statusText;
            }
            else
            {
                //console.log(result);

                if(password != result.password)
                {
                    //console.log('invalid password');
                    statusText = 'invalid password';
                    return statusText;
                }
                
                else if(email == result.email && password == result.password)
                {
                    let cookieId = Math.random();
                    
                    let updateSuccessful = 1;
                    let updateFailed = 0;                    
                    let sessionSuccessful = 1;
                    let sessionFailed = 0;

                    return User.updateOne(email, cookieId, true).then(result => {
                        if(result == updateSuccessful)
                        {
                            return Session.createSession(email, cookieId).then(result => {
                                if(result == sessionSuccessful)
                                {
                                    //console.log('update of user successful');
                                    //console.log('session created successful');
                                    //console.log('login successful');
                                    
                                    statusText = 'login successful';

                                    var obj = {statusText: statusText, cookieId: cookieId, email: email};
                                    return obj;
                                }
                                if(result == sessionFailed)
                                {
                                    //console.log('creation of session failed');
                                    statusText = 'database error, try again in a few minutes';
                                    return statusText;
                                }
                            }).catch(err => {console.log(err); return "error"});              
                        }

                        if(result == updateFailed)
                        {
                            //console.log('update of user failed');
                            statusText = 'database error, try again in a few minutes';
                            return statusText;
                        }
                    })
                }
            }             
        })
        .catch(err => console.log(err))
    }

    static logout(reqCookie)
    {
        let deleteSuccessful = 1;
        let deleteFailed = 0;
        let updateSuccessful = 1;
        let updateFailed = 0;

        var findLoginCookie = reqCookie;
        var regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g;
        var regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g;
        var loginCookieId = findLoginCookie.match(regexFindLoginCookieId);
        var loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail);
    
        var cookieId = parseFloat(loginCookieId);
        var email = String(loginCookieEmail);
        //console.log(cookieId);
        //console.log(email);
    
        return Session.deleteOne(cookieId).then(result => {
            if(result == deleteSuccessful)
            {
                //res.setHeader('Set-Cookie', 'loginCookie=empty');
                return User.updateOne(email, 'expired:' + cookieId, false).then(result => {
                    if(result == updateSuccessful)
                    {
                        console.log('logout user: ' + email + ' successful');
                        return updateSuccessful;
                    }
    
                    else
                    {
                        console.log('logout user: ' + email + ' failed');
                        return updateFailed;
                    }
    
                })
    
            }
    
            else
            {
                console.log('logout user: ' + email + ' failed');
                return deleteFailed;
            }
        })
    }

    static register(email, username, password)
    {
        const db = getDb();

        let statusText = "";
        let cookieId = Math.random();

        db.collection('users')
        .find({username: username})
        .next()
        .then(result => {
            if(result == null)
            {
                username = username;
                //console.log('username is available');
                //console.log(username);
            }
            else
            {
                username = null;
                //console.log('username is taken');
            }             
        })
        .catch(err => console.log(err))

        return db.collection('users')
        .find({email: email})
        .next()
        .then(result => {
            //if email is available
            if(result == null)
            {
                email = email;
                //console.log('email is available');
                //console.log(email);
                return cb();
            }
            else
            {
                email = null;
                //console.log('email is taken') 
                return cb();
            }  
        })
        .catch(err => console.log(err))

        function cb()
        {
            //if username is taken
            if(username == null)
            {
                statusText = 'username is taken';
                return statusText;
            }

            //if email is taken
            else if(email == null)
            {
                statusText = 'email is taken';
                return statusText;
            }

            //if username and email is available
            else if(username != null && email != null)
            {
                    let user = new User(email, username, "12356", false, null, true, cookieId)

                    return user.save().then(result => {
                        if(result != "error")
                        {
                            console.log('register user: ' + email + ' successful');
                            //console.log(user);
                            statusText = 'registration successful';
                            return statusText;
                        }

                        if(result == "error")
                        {
                            //console.log('database error');
                            statusText = 'database error, try again in a few minutes';
                            return statusText;
                        }
                    });
            }

            else
            {
                console.log('error line 217 in user.js');
            }
        }
        
    }

}

module.exports = User;