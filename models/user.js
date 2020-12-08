const getDb = require('../controllers/database').getDb;
const mongodb = require('mongodb');
const Session = require('./session');
const ObjectId = mongodb.ObjectId;

class User
{
    constructor(email, name, password, admin, cart, isLoggedIn, loginCookie, orders)
    {
        this.email = email;
        this.loginCookie = loginCookie;
        this.password = password;
        this.isLoggedIn = isLoggedIn;
        this.admin = admin;
        this.name = name;
        this.cart = cart;
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

    static validateLogin(cookieId)
    {   
        //check if cookie have a session
        return Session.findByCookieId(cookieId)
            .then(result => {

                var cookieFromSessions;
                var cookieFromUsers;

                if(result == null)
                {
                    //console.log('login cookie not found');
                    return false;
                }

                else
                {
                    cookieFromSessions = result.loginCookie;

                    //check if cookie have a user
                    return User.findByEmail(result.email).then(result => 
                    {
                        cookieFromUsers = result.loginCookie;

                        if(cookieFromSessions == cookieFromUsers)
                        {
                            var obj = {status: true, isAdmin: result.admin, userEmail: result.email};
                            return obj;
                        }

                        else
                        {
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
                    //console.log('delete ' + email + ' document successful');
                    return deleteSuccessful;
                } 
                else
                {
                    //console.log('delete ' + email + ' document failed');
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
        
    static updateAdmin(userId, name, address, phone, isLoggedIn)
    {       
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;
        
        var dateObject = new Date().toString();
        var sub1 = dateObject.substring(16, 24);
        var sub2 = dateObject.substring(0, 15);
        var dateFormatted = sub1 + " - " + sub2;

        return db.collection("users")
            .updateOne({_id: ObjectId(userId)},         
                {$set: 
                {
                    userId: userId,
                    name: name,
                    address: address,
                    phone: phone,
                    isLoggedIn: isLoggedIn,
                    updatedAt: dateFormatted
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

    static updateCredentials(email, name, address, phone)
    {
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;

        return db.collection('users')
            .updateOne({email: email},         
                {$set: 
                {
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

    static updateEmail(oldEmail, newEmail)
    {
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;

        return db.collection('users')
            .updateOne({email: oldEmail},         
                {$set: 
                {
                    email: newEmail,
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

    static updatePassword(email, newPassword)
    {
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;

        return db.collection('users')
            .updateOne({email: email},         
                {$set: 
                {
                    password: newPassword
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
                statusText = 'email is invalid';
                return statusText;
            }
            else
            {
                if(password != result.password)
                {
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
                                    statusText = 'login successful';

                                    var obj = {statusText: statusText, cookieId: cookieId, email: email};
                                    return obj;
                                }
                                if(result == sessionFailed)
                                {
                                    statusText = 'database error, try again in a few minutes';
                                    return statusText;
                                }
                            }).catch(err => {console.log(err); return "error"});              
                        }

                        if(result == updateFailed)
                        {
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
    
        return Session.deleteOne(cookieId).then(result => {
            if(result == deleteSuccessful)
            {
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

    static register(email, name, password)
    {
        const db = getDb();

        let statusText = "";
        let successful = 1;

        //check if email is taken
        return db.collection('users')
        .find({email: email})
        .next()
        .then(result => {
            //if email is available
            if(result == null)
            {
                email = email;
                return cb();
            }
            
            //if email is taken
            else
            {
                email = null;
                return cb();
            }
        })
        .catch(err => console.log(err))

        async function cb()
        {
            //if email is taken
            if(email == null)
            {
                return statusText = 'email is taken';
            }

            //if email is available
            else if(name != null && email != null)
            {
                var registerUser = await db.collection('users').insertOne(
                {
                    email: email,
                    name: name,
                    address: null,
                    phone: null,
                    cart: null,
                    loginCookie: null,
                    isLoggedIn: false,
                    admin: false,
                    restaurantName: null,
                    companyIdNumber: null,
                    password: password,
                    createdAt: new Date(),
                })
                   
                if(registerUser.insertedCount == successful)
                {
                    return statusText = 'registration successful';
                }
                
                else
                {
                    return statusText = 'database error';
                }
            }
        }
        
    }

    static async registerRestaurant(email, address, phone, owner, restaurantName, companyIdNumber, password, city)
    {
        //get db
        const db = getDb();

        //generate cookie id
        let statusText = "";
        let successful = 1;

        //check if email is taken
        return db.collection('users')
        .find({email: email})
        .next()
        .then(result => {
            //if email is available
            if(result == null)
            {
                email = email;
                //console.log('email is available');
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

        async function cb()
        {
            //if email is taken
            if(email == null)
            {
                return statusText = 'email is taken';
            }
            
            else if(email != null)
            {
                       
                var registerUser = await db.collection('users').insertOne(
                {
                    email: email,
                    name: owner,
                    address: address,
                    phone: phone,
                    cart: null,
                    loginCookie: null,
                    isLoggedIn: false,
                    admin: false,
                    restaurantName: restaurantName,
                    companyIdNumber: companyIdNumber,
                    password: password,
                    createdAt: new Date()
                })

                //set up temporary restaurant values
                var hours = [];
                hours.push({day: "Monday", time: "11-23"})
                hours.push({day: "Tuesday", time: "11-Late"})
                hours.push({day: "Wednesday", time: "Closed"})
                hours.push({day: "Thursday", time: "Closed"})
                hours.push({day: "Friday", time: "Closed"})
                hours.push({day: "Saturday", time: "Closed"})
                hours.push({day: "Sunday", time: "Closed"})

                var description = "description of " + restaurantName;
                var imageUrl = "pics/exampleImage.jpg";
                
                var menuCategories = [];

                var type = "Pasta, Pizza, Sallad";

                var menuItems = [];

                var url = restaurantName;
                url = url.toString().toLowerCase();
                url = url.toString().split(" ");
                url = url.toString().replace(/,/g, "-");
                       
                var registerRestaurant = await db.collection('restaurants').insertOne(
                {
                    email: email,
                    owner: owner,
                    address: address,
                    phone: phone,
                    companyIdNumber,
                    url: url,
                    title: restaurantName,
                    open: false,
                    status: null,
                    menuOnline: false,
                    menuListed: false,
                    hours: hours,
                    description: description,
                    imageUrl: imageUrl,
                    menuCategories: menuCategories,
                    menuItems: menuItems,
                    rating: null,
                    type: type,
                    city: city,
                    createdAt: new Date(),
                    welcomeMessage: true
                })

                if(registerUser.insertedCount == successful && registerRestaurant.insertedCount == successful)
                {
                    return statusText = 'registration successful';
                }
                
                else
                {
                    return statusText = 'database error';
                }

            }

        }
        
    }

}

module.exports = User;