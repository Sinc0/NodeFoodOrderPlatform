const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class Admin
{
    static createNewsPost(type, postId, date, title, text)
    {
        const db = getDb();
        return db
            .collection('admin')
            .insertOne({
                type: type,
                postId, postId,
                date: date,
                title: title,
                text: text
            })
            .then(review => {/* console.log(review); */ return review;})
            .catch(err => console.log(err));
    }

    static updateNewsPost(id, postId, date, title, text)
    {       
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;
        
        var dateObject = new Date().toString();
        var sub1 = dateObject.substring(16, 24);
        var sub2 = dateObject.substring(0, 15);
        var dateFormatted = sub1 + " - " + sub2;

        return db.collection("admin")
            .updateOne({_id: ObjectId(id)},         
                {$set: 
                {
                    postId: postId,
                    date: date,
                    title: title,
                    text: text,
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

    static deleteOne(id)
    {
        const db = getDb();

        return db.collection('admin')
        .deleteOne({_id: ObjectId(id)})
        .then(result => {/* console.log(result); */ return result.deletedCount })
        .catch(err => console.log(err));
    }

    static fetchAllPosts()
    {
        const db = getDb();

        return db
            .collection("admin")
            .find({type: "post"})
            .toArray()
            .then(posts => { /* { console.log(orders) */ return posts })
            .catch(err => console.log(err));
    }

}

module.exports = Admin;