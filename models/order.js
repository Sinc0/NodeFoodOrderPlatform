//imports
const getDb = require('../controllers/database').getDb
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId


class Order 
{
    static createOrder(userEmail, productArray, totalPrice, customerComment, restaurant, customerName, customerPhone, customerAddress, customerDelivery, restaurantTitle)
    {
        //get db
        const db = getDb()

        //variables
        let dateObject = new Date().toString()
        let dateFormatted = dateObject.substring(16, 24) + " - " + dateObject.substring(0, 15)
        let type = null
        
        //check type
        if(customerDelivery == "delivery") { type = "delivery" }
        else if(customerDelivery == "pickUp") { type = "pick up" }
   
        //update db
        return db
                .collection('orders')
                .insertOne({
                        user: userEmail,
                        date: new Date(),
                        placedAt: dateFormatted,
                        confirmedAt: null,
                        completedAt: null,
                        estimatedCompletionTime: null,
                        status: "unconfirmed",
                        restaurant: restaurantTitle,
                        restaurantUrl: restaurant,
                        totalPrice: "$" + totalPrice,
                        customerName: customerName,
                        customerPhone: customerPhone,
                        customerAddress: customerAddress,
                        customerComment: customerComment,
                        type: type,
                        products: productArray,
                        rating: null,
                })  
                .catch(err => {
                    console.log(err) 
                    return null
                })
    }


    static findById(orderId)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .findOne({_id: ObjectId(orderId)})
                .then(order => { return order })
                .catch(err => {console.log(err)})
    }


    static FindByUser(userEmail)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .find({user: userEmail})
                .toArray()
                .then(order => {
                    if(order.length != 0) { return order }
                    else { return null }
                })
                .catch(err => console.log(err))
    }


    static async updateWithReview(orderId, reviewObject)
    {
        //get db
        const db = getDb()
   
        //update db
        await db
                .collection('orders')
                .updateOne({_id: ObjectId(orderId)},{ $set: { review: reviewObject }})
    }


    static updateOne(orderId, status, estimatedCompletionTime, completedAt)
    {
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0
        let dateObject = new Date().toString()
        let dateFormatted = dateObject.substring(16, 24) + " - " + dateObject.substring(0, 15)
        let estct = estimatedCompletionTime

        //update db
        return db
                .collection("orders")
                .updateOne({_id: ObjectId(orderId)}, {$set: { status: status, estimatedCompletionTime: estct, confirmedAt: dateFormatted }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }


    static updateAdmin(orderId, date, user, status, restaurant)
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
                .collection("orders")
                .updateOne({_id: ObjectId(orderId)}, {$set: { 
                        date: date, 
                        user: user, 
                        customerName: user, 
                        status: status, 
                        restaurant: restaurant,
                        updatedAt: dateFormatted
                }})
                .then(result => {
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }})
                .catch(err => console.log(err))
    }


    static deleteOne(orderId)
    {
        //get db
        const db = getDb()

        //variables
        let deleteSuccessful = 1
        let deleteFailed = 0

        //update db
        return db
                .collection("orders")
                .deleteOne({_id: ObjectId(orderId)})
                .then(result => {
                    if(result.deletedCount == deleteSuccessful) { return deleteSuccessful } 
                    else { return deleteFailed }})
                .catch(err => console.log(err))
    }


    static fetchAll()
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .find()
                .toArray()
                .then(orders => { return orders })
                .catch(err => console.log(err))
    }


    static fetchAllByRestaurantUrl(restaurantUrl)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .find({restaurantUrl: restaurantUrl})
                .toArray()
                .then(orders => { return orders })
                .catch(err => console.log(err))
    }


    static fetchAllUnconfirmed(restaurantUrl)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .find({status: "unconfirmed", restaurantUrl: restaurantUrl})
                .toArray()
                .then(orders => { return orders })
                .catch(err => console.log(err))
    }


    static fetchAllConfirmed(restaurantUrl)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .find({status: "confirmed", restaurantUrl: restaurantUrl})
                .toArray()
                .then(orders => { return orders })
                .catch(err => console.log(err))
    }


    static fetchAllDeclined(restaurantUrl)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection("orders")
                .find({status: "declined", restaurantUrl: restaurantUrl})
                .toArray()
                .then(orders => { return orders })
                .catch(err => console.log(err))
    }

    
    static fetchAllCompleted(restaurantUrl)
    {
        //get db
        const db = getDb()

        //udpate db
        return db
                .collection("orders")
                .find({status: "completed", restaurantUrl: restaurantUrl})
                .toArray()
                .then(orders => { return orders })
                .catch(err => console.log(err))
    }
}


//exports
module.exports = Order