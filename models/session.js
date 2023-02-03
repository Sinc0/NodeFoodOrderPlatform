//imports
const getDb = require('../controllers/database').getDb


class Session
{
    constructor(email, password, loginCookie, isLoggedIn)
    {
        this.email = email
        this.password = password
        this.loginCookie = loginCookie
        this.isLoggedIn = isLoggedIn
    }


    static createSession(email, loginCookie)
    {
        //get db
        const db = getDb()

        //variables
        let insertSuccessful = 1
        let insertFailed = 0

        //update db
        return db
                .collection('sessions')
                .insertOne({
                    createdAt: new Date(),
                    email: email,
                    loginCookie: loginCookie,
                })
                .then(result => {
                    if(result.insertedCount == insertSuccessful) { return insertSuccessful }
                })
                .catch(err => { return insertFailed })
    }


    static deleteOne(cookieId)
    {
        //get db
        const db = getDb()

        //variables
        let deleteSuccessful = 1
        let deleteFailed = 0

        //update db
        return db
                .collection('sessions')
                .deleteOne({loginCookie: cookieId})
                .then(result => {
                    if(result.deletedCount == deleteSuccessful) { return deleteSuccessful } 
                    else { return deleteFailed }})
                .catch(err => console.log(err))
    }


    static findByCookieId(cookie)
    {
        //update db
        const db = getDb()
        
        //update db
        return db
                .collection('sessions')
                .find({loginCookie: cookie})
                .next()
                .then(user => {
                    if(user != null) { process.stdout.write("\n" + user.email + " > "); return user }
                    else { process.stdout.write("anon > ") }})
                .catch(err => console.log(err))
    }
}


//exports
module.exports = Session