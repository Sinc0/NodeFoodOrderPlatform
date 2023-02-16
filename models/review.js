
//imports
const getDb = require('../controllers/database').getDb
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

class Review
{
    static create(user, restaurant, reviewObject, orderId)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('reviews')
                .insertOne({ orderId, orderId, restaurant: restaurant, user: user, reviewObject: reviewObject })
                .then(review => { return review })
                .catch(err => console.log(err))
    }


    static async update(user, restaurant, reviewObject, orderId)
    {
        //get db
        const db = getDb()
   
        //update db
        await db
               .collection('reviews')
               .updateOne({orderId: orderId}, {$set: { restaurant: restaurant, user: user, reviewObject: reviewObject }})
    }

    
    static updateAdmin(reviewId, date, restaurant, rating, user, items, comment, name)
    {       
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0
        let dateObject = new Date().toString()
        let dateFormatted = dateObject.substring(16, 24) + " - " + dateObject.substring(0, 15)

        //update db
        return db
                .collection("reviews")
                .updateOne({_id: ObjectId(reviewId)}, {$set: {
                    restaurant: restaurant,
                    reviewObject: { date: date, rating: rating, user: user, items: items, comment: comment, name: name },
                    updatedAt: dateFormatted
                }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }
                })
                .catch(err => console.log(err))
    }


    static deleteOne(reviewId)
    {
        //get db
        const db = getDb()
        
        //update db
        return db
                .collection('reviews')
                .deleteOne({_id: ObjectId(reviewId) })
                .then(result => { return result.deletedCount })
                .catch(err => console.log(err))
    }


    static fetchAll()
    {
        //get db
        const db = getDb()

        //fetch all
        return db
                .collection('reviews')
                .find()
                .toArray()
                .then(reviews => { return reviews })
                .catch(err => console.log(err))
    }


    static fetchAllByRestaurantUrl(restaurantUrl)
    {
        //get db
        const db = getDb()

        //fetch restaurant
        return db
                .collection('reviews')
                .find({restaurant: restaurantUrl})
                .toArray()
                .then(reviews => { return reviews })
                .catch(err => console.log(err))
    }


    static findById(cartId)
    {
        //get db
        const db = getDb()
        
        //fetch cart
        return db
                .collection('carts')
                .find({_id: ObjectId(cartId)})
                .next()
                .then(cart => { return cart })
                .catch(err => console.log(err))
    }
    

    static findByOrderId(orderId)
    {
        //get db
        const db = getDb()

        //fetch review
        return db
                .collection('reviews')
                .find({orderId: orderId})
                .next()
                .then(review => { return review })
                .catch(err => console.log(err))
    }
}

//exports
module.exports = Review