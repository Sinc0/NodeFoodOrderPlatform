//imports
const getDb = require('../controllers/database').getDb
const mongodb = require('mongodb')
const Session = require('./session')
const ObjectId = mongodb.ObjectId


class User
{
    constructor(email, name, password, admin, cart, isLoggedIn, loginCookie, orders)
    {
        this.email = email
        this.loginCookie = loginCookie
        this.password = password
        this.isLoggedIn = isLoggedIn
        this.admin = admin
        this.name = name
        this.cart = cart
        this.orders = orders
    }
     
    
    save() 
    {
        //get db
        const db = getDb()
        
        //update db
        return db
                .collection('users')
                .insertOne(this)
                .then()
                .catch(err => {console.log(err); return "error"})
    }


    static validateLogin(cookieId)
    {   
        //check if cookie have a session
        return Session
                    .findByCookieId(cookieId)
                    .then(result => {

                        let cookieFromSessions
                        let cookieFromUsers

                        if(result == null) { return false }
                        else
                        {
                            cookieFromSessions = result.loginCookie

                            //check if cookie have a user
                            return User.findByEmail(result.email).then(result => 
                            {
                                cookieFromUsers = result.loginCookie

                                if(cookieFromSessions == cookieFromUsers)
                                {
                                    let obj = {status: true, isAdmin: result.admin, userEmail: result.email}
                                    return obj
                                }
                                else
                                {
                                    return false
                                }
                            })
                        }
                })
        
    }


    static deleteOne(email)
    {
        //get db
        const db = getDb()

        //variables
        let deleteSuccessful = 1
        let deleteFailed = 0

        //update db
        return db
                .collection('users')
                .deleteOne({email: email})
                .then(result => {
                    if(result.deletedCount == deleteSuccessful) { return deleteSuccessful } 
                    else { return deleteFailed }})
                .catch(err => console.log(err))
    }


    static updateOne(email, cookieId, isLoggedIn)
    {
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0
        
        //update db
        return db
                .collection('users')
                .updateOne({email: email},         
                    {$set: { email: email, loginCookie: cookieId, isLoggedIn: isLoggedIn }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }
       
    
    static updateAdmin(userId, name, address, phone, isLoggedIn)
    {       
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0
        let dateObject = new Date().toString()
        let sub1 = dateObject.substring(16, 24)
        let sub2 = dateObject.substring(0, 15)
        let dateFormatted = sub1 + " - " + sub2

        //update db
        return db
                .collection("users")
                .updateOne({_id: ObjectId(userId)},         
                    {$set: { userId: userId, name: name, address: address, phone: phone, isLoggedIn: isLoggedIn, updatedAt: dateFormatted }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }


    static updateCredentials(email, name, address, phone)
    {
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0

        //update db
        return db
                .collection('users')
                .updateOne({email: email},         
                    {$set: { name: name, address: address, phone: phone }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }


    static updateEmail(oldEmail, newEmail)
    {
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0

        //update db
        return db
                .collection('users')
                .updateOne({email: oldEmail},         
                    {$set: { email: newEmail }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }


    static updatePassword(email, newPassword)
    {
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0

        //update db
        return db
                .collection('users')
                .updateOne({email: email},         
                    {$set: { password: newPassword }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }


    static fetchAll()
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('users')
                .find()
                .toArray()
                .then(users => { return users })
                .catch(err => console.log(err))
    }


    static findById(userId)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('users')
                .findOne({_id: ObjectId(userId)})
                .then(user => {
                    return user
                })
                .catch(err => {console.log(err)})
    }


    static findByCookieId(cookie)
    {
        //get db
        const db = getDb()

        //variables
        let u

        //update db
        return db
                .collection('users')
                .find({loginCookie: cookie})
                .next()
                .then(user => { u = user; return cb() })
                .catch(err => console.log(err))

        function cb()
        {
            if(u == null) { return u }
            else if(u != null) { return u.loginCookie }
        }
    }


    static findByCookieIdReturnUserObject(cookie)
    {
        //get db
        const db = getDb()

        //variables
        let u

        //update db
        return db
                .collection('users')
                .find({loginCookie: cookie})
                .next()
                .then(user => { u = user; return user })
                .catch(err => console.log(err))
    }
    

    static findByUsername(username)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('users')
                .find({username: username})
                .next()
                .then(user => { return user })
                .catch(err => console.log(err))
    }


    static findByEmail(email)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('users')
                .find({email: email})
                .next()
                .then(user => { return user })
                .catch(err => console.log(err))
    }
    

    static login(email, password)
    {
        //get db
        const db = getDb()

        //variables
        let statusText = ''

        //update db
        return db
                .collection('users')
                .find({email: email})
                .next()
                .then(result => {
                    if(result == null)
                    {
                        statusText = 'email is invalid'
                        return statusText
                    }
                    else
                    {
                        if(password != result.password)
                        {
                            statusText = 'invalid password'
                            return statusText
                        }
                        else if(email == result.email && password == result.password)
                        {
                            let cookieId = Math.random()
                            let updateSuccessful = 1
                            let updateFailed = 0               
                            let sessionSuccessful = 1
                            let sessionFailed = 0

                            return User
                                    .updateOne(email, cookieId, true)
                                    .then(result => {
                                        if(result == updateSuccessful)
                                        {
                                            return Session
                                                        .createSession(email, cookieId)
                                                        .then(result => {
                                                            if(result == sessionSuccessful)
                                                            {                                    
                                                                statusText = 'login successful'
                                                                let obj = {statusText: statusText, cookieId: cookieId, email: email}
                                                                return obj
                                                            }
                                                            else if(result == sessionFailed)
                                                            {
                                                                statusText = 'database error, try again in a few minutes'
                                                                return statusText
                                                            }
                                                        }).catch(err => {console.log(err); return "error"})             
                                        }
                                        else if(result == updateFailed)
                                        {
                                            statusText = 'database error, try again in a few minutes'
                                            return statusText
                                        }
                            })
                        }
                    }             
                })
                .catch(err => console.log(err))
    }


    static logout(reqCookie)
    {
        //variables
        let deleteSuccessful = 1
        let deleteFailed = 0
        let updateSuccessful = 1
        let updateFailed = 0
        let findLoginCookie = reqCookie;
        let regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g
        let regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g
        let loginCookieId = findLoginCookie.match(regexFindLoginCookieId)
        let loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail)
        let cookieId = parseFloat(loginCookieId)
        let email = String(loginCookieEmail)
    
        //update db
        return Session
                    .deleteOne(cookieId)
                    .then(result => {
                        if(result == deleteSuccessful)
                        {
                            return User
                                      .updateOne(email, 'expired:' + cookieId, false)
                                      .then(result => {
                                          if(result == updateSuccessful)
                                          {
                                              process.stdout.write('logout user: ' + email + ' successful')
                                              return updateSuccessful
                                          }
                                          else
                                          {
                                              process.stdout.write('logout user: ' + email + ' failed')
                                              return updateFailed
                                          }
                                      })
                        }
                        else
                        {
                            process.stdout.write('logout user: ' + email + ' failed')
                            return deleteFailed
                        }
                    })
    }


    static register(email, name, password)
    {
        //get db
        const db = getDb()

        //variables
        let statusText = ""
        let successful = 1

        
        //update db
        return db
                .collection('users')
                .find({email: email})
                .next()
                .then(result => {
                    if(result == null) //if email is available
                    {
                        email = email
                        return cb()
                    }
                    else //if email is taken
                    {
                        email = null
                        return cb()
                    }
                })
                .catch(err => console.log(err))

        async function cb()
        {
            if(email == null) //if email is taken
            {
                return statusText = 'email is taken'
            }            
            else if(name != null && email != null) //if email is available
            {
                //update db
                let registerUser = await db
                                          .collection('users')
                                          .insertOne(
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
                
                                          //set status text
                if(registerUser.insertedCount == successful) { return statusText = 'registration successful' }
                else { return statusText = 'database error' }
            }
        }
    }


    static async registerRestaurant(email, address, phone, owner, restaurantName, companyIdNumber, password, city)
    {
        //get db
        const db = getDb()

        //variables
        let statusText = ""
        let successful = 1

        //update db
        return db
                .collection('users')
                .find({email: email})
                .next()
                .then(result => {
                    if(result == null) //if email is available
                    {
                        email = email
                        return cb()
                    }
                    else
                    {
                        email = null
                        return cb()
                    }  
                })
                .catch(err => console.log(err))

        async function cb()
        {
            if(email == null) //if email is taken
            {
                return statusText = 'email is taken'
            }
            else if(email != null)
            {
                //update db
                let registerUser = await db
                                          .collection('users')
                                          .insertOne(
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

                //set default values
                let hours = []
                hours.push({day: "Monday", time: "11-23"})
                hours.push({day: "Tuesday", time: "11-Late"})
                hours.push({day: "Wednesday", time: "Closed"})
                hours.push({day: "Thursday", time: "Closed"})
                hours.push({day: "Friday", time: "Closed"})
                hours.push({day: "Saturday", time: "Closed"})
                hours.push({day: "Sunday", time: "Closed"})
                let url = restaurantName
                let description = "description of " + restaurantName
                let imageUrl = "/exampleImage.jpg"
                let type = "Pasta, Pizza, Sallad"
                let menuCategories = [{position: 1, categoryName: "meat"}, {position: 2, categoryName: "chicken"}, {position: 3, categoryName: "drinks"}]
                let menuItems = [
                    {position: 1, id: "meat1", category: "meat", title: "meat item 1", price: "10", description: "description of meat item 1"},
                    {position: 2, id: "meat2", category: "meat", title: "meat item 2", price: "10", description: "description of meat item 2"},
                    {position: 3, id: "meat3", category: "meat", title: "meat item 3", price: "10", description: "description of meat item 3"},
                    {position: 1, id: "chicken1", category: "chicken", title: "chicken item 1", price: "10", description: "description of chicken item 1"},
                    {position: 2, id: "chicken2", category: "chicken", title: "chicken item 2", price: "10", description: "description of chicken item 2"},
                    {position: 3, id: "chicken3", category: "chicken", title: "chicken item 3", price: "10", description: "description of chicken item 3"},
                    {position: 1, id: "drinks1", category: "drinks", title: "drinks item 1", price: "10", description: "description of drinks item 1"},
                    {position: 2, id: "drinks2", category: "drinks", title: "drinks item 2", price: "10", description: "description of drinks item 2"},
                    {position: 3, id: "drinks3", category: "drinks", title: "drinks item 3", price: "10", description: "description of drinks item 3"}
                ]
                url = url.toString().toLowerCase()
                url = url.toString().split(" ")
                url = url.toString().replace(/,/g, "-")
                
                //update db
                let registerRestaurant = await db
                                                .collection('restaurants')
                                                .insertOne(
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

                //set status text
                if(registerUser.insertedCount == successful && registerRestaurant.insertedCount == successful)
                {
                    return statusText = 'registration successful'
                }
                else
                {
                    return statusText = 'database error'
                }
            }
        }
    }
}


//exports
module.exports = User