//imports
const getDb = require('../controllers/database').getDb;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

class Admin
{
    // static createNewsPost(type, postId, date, title, text)
    // {
    //     //get db
    //     const db = getDb();
        
    //     //update db
    //     return db
    //             .collection('admin')
    //             .insertOne({
    //                 type: type,
    //                 postId, postId,
    //                 date: date,
    //                 title: title,
    //                 text: text
    //             })
    //             .then(review => { return review;})
    //             .catch(err => console.log(err));
    // }


    // static updateNewsPost(id, postId, date, title, text)
    // {       
    //     //get db
    //     const db = getDb();

    //     //variables
    //     let updateSuccessful = 1;
    //     let updateFailed = 0;
    //     let dateObject = new Date().toString();
    //     let sub1 = dateObject.substring(16, 24);
    //     let sub2 = dateObject.substring(0, 15);
    //     let dateFormatted = sub1 + " - " + sub2;

    //     //update db
    //     return db.collection("admin")
    //             .updateOne({_id: ObjectId(id)}, { $set: { postId: postId, date: date, title: title, text: text, updatedAt: dateFormatted }})
    //             .then(result => {
    //                 if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
    //                 else { return updateFailed }
    //             })
    //             .catch(err => console.log(err))
    // }


    // static deleteOne(id)
    // {
    //     //get db
    //     const db = getDb();

    //     //update db
    //     return db.collection('admin')
    //             .deleteOne({_id: ObjectId(id)})
    //             .then(result => { return result.deletedCount })
    //             .catch(err => console.log(err))
    // }

    
    // static fetchAllPosts()
    // {
    //     //get db
    //     const db = getDb();

    //     //update db
    //     return db
    //             .collection("admin")
    //             .find({type: "post"})
    //             .toArray()
    //             .then(posts => { return posts })
    //             .catch(err => console.log(err));
    // }
}

module.exports = Admin;