const getDb = require('../controllers/database').getDb;

class Session
{
    constructor(email, password, loginCookie, isLoggedIn)
    {
        this.email = email;
        this.password = password;
        this.loginCookie = loginCookie;
        this.isLoggedIn = isLoggedIn;
    }

    static createSession(email, loginCookie)
    {
        const db = getDb()

        let insertSuccessful = 1;
        let insertFailed = 0;

        //let session = new Session(email, password, loginCookie, isLoggedIn);

        return db.collection('sessions')
        .insertOne({
            createdAt: new Date(),
            email: email,
            loginCookie: loginCookie,
        })
        .then(result => {
            if(result.insertedCount == insertSuccessful)
            {
                //console.log('insert of session document successful');
                return insertSuccessful;
            }
        })
        .catch(err => {
            console.log(err); 
            //console.log('insert of session document failed'); 
            return insertFailed
        });
    }

    static deleteOne(cookieId)
    {
        const db = getDb();

        let deleteSuccessful = 1;
        let deleteFailed = 0;

        return db.collection('sessions')
            .deleteOne({loginCookie: cookieId})
            .then(result => {
                if(result.deletedCount == deleteSuccessful)
                {
                    //console.log('delete session document successful');
                    return deleteSuccessful;
                } 
                else
                {
                    //console.log('delete session document failed');
                    return deleteFailed;
                } })
            .catch(err => console.log(err));
    }

    static findByCookieId(cookie)
    {
        const db = getDb();
        
        return db
            .collection('sessions')
            .find({loginCookie: cookie})
            .next()
            .then(user => {
                if(user != null)
                {
                    console.log('');
                    console.log(user.email + ' >'); 
                    return user;
                }
                else
                {
                    console.log("anon user >")
                }
            })
            .catch(err => console.log(err))
    }

}

module.exports = Session;