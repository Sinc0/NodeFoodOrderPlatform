const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class Review
{
    static create(user, restaurant, reviewObject, orderId)
    {
        const db = getDb();
        return db
            .collection('reviews')
            .insertOne({
                orderId, orderId,
                restaurant: restaurant,
                user: user,
                reviewObject: reviewObject
            })
            .then(review => {/* console.log(review); */ return review;})
            .catch(err => console.log(err));
    }

    static async update(user, restaurant, reviewObject, orderId)
    {
        const db = getDb();
   
        var updateWithReview = await db.collection('reviews').updateOne({orderId: orderId},
        {$set: 
            {
                restaurant: restaurant,
                user: user,
                reviewObject: reviewObject
            }
        })
    }

    static fetchAll()
    {
        const db = getDb();
        return db
            .collection('reviews')
            .find()
            .toArray()
            .then(reviews => {console.log(reviews); return reviews;})
            .catch(err => console.log(err));
    }

    static fetchAllByRestaurantUrl(restaurantUrl)
    {
        const db = getDb();
        return db
            .collection('reviews')
            .find({restaurant: restaurantUrl})
            .toArray()
            .then(reviews => {console.log(reviews); return reviews;})
            .catch(err => console.log(err));
    }

    static findById(cartId)
    {
        const db = getDb();
        return db
            .collection('carts')
            .find({_id: ObjectId(cartId)})
            .next()
            .then(cart => {
                console.log(cart); 
                return cart;
            })
            .catch(err => console.log(err))
    }
    
    
    static findByOrderId(orderId)
    {
        const db = getDb();
        return db
            .collection('reviews')
            .find({orderId: orderId})
            .next()
            .then(review => {
                //console.log(review); 
                return review;
            })
            .catch(err => console.log(err))
    }
}

module.exports = Review;