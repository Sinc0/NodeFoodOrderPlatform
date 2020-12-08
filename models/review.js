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

            
    static updateAdmin(reviewId, date, restaurant, rating, user, items, comment)
    {       
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;
        
        var dateObject = new Date().toString();
        var sub1 = dateObject.substring(16, 24);
        var sub2 = dateObject.substring(0, 15);
        var dateFormatted = sub1 + " - " + sub2;

        return db.collection("reviews")
            .updateOne({_id: ObjectId(reviewId)},         
                {$set: 
                {
                    restaurant: restaurant,
                    reviewObject: {
                        date: date,
                        rating: rating,
                        user: user,
                        items: items,
                        comment: comment
                    },
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

    static deleteOne(reviewId)
    {
        const db = getDb();

        return db.collection('reviews')
            .deleteOne({_id: ObjectId(reviewId)})
            .then(result => {/* console.log(result); */ return result.deletedCount })
            .catch(err => console.log(err));
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