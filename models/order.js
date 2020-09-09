const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');
const Session = require('./session');
const User = require('./user');

const ObjectId = mongodb.ObjectId;

class Order 
{
    static async createOrder(userEmail, productArray, totalPrice, customerComment, restaurant, customerName, customerPhone, customerAddress, customerDelivery)
    {
        const db = getDb();

        let insertSuccessful = 1;

        var dateObject = new Date().toString();
        var sub1 = dateObject.substring(16, 24);
        var sub2 = dateObject.substring(0, 15);
        var dateFormatted = sub1 + " - " + sub2;
        
        if(customerDelivery == "delivery")
        {
            var delivery = true;
            var pickUp = false;
        }

        if(customerDelivery = "pickUp")
        {
            delivery = false;
            pickUp = true;
        }
   
        return db.collection('orders')
            .insertOne({
                user: userEmail,
                date: new Date(),
                placedAt: dateFormatted,
                confirmedAt: null,
                completedAt: null,
                estimatedCompletionTime: null,
                status: "unconfirmed",
                restaurant: restaurant,
                totalPrice: "$" + totalPrice,
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                customerComment: customerComment,
                delivery: delivery,
                pickUp: pickUp,
                products: productArray,
                rating: null,
            })  
            .catch(err => {
                console.log(err); 
                //console.log('insert of session document failed'); 
                return null;
            });
    }

    static findById(orderId)
    {
        const db = getDb();

        //check if userId characters are by the rules or else redirect
        
        return db
            .collection("orders")
            .findOne({_id: ObjectId(orderId)})
            .then(order => {
                //console.log(order); 
                return order;
            })
            .catch(err => {console.log(err)})
    }

    static FindByUser(userEmail)
    {
        const db = getDb();

        return db
            .collection("orders")
            .find({user: userEmail})
            .toArray()
            .then(order => {
                if(order.length != 0)
                {
                    //console.log(order)
                    return order;
                }

                else
                {
                    return null;
                }
            })
            .catch(err => console.log(err))
    }

    static updateOne(orderId, status, estimatedCompletionTime)
    {
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;
        
        var dateObject = new Date().toString();
        var sub1 = dateObject.substring(16, 24);
        var sub2 = dateObject.substring(0, 15);
        var dateFormatted = sub1 + " - " + sub2;

        return db.collection("orders")
            .updateOne({_id: ObjectId(orderId)},         
                {$set: 
                {
                    status: status,
                    estimatedCompletionTime: estimatedCompletionTime,
                    confirmedAt: dateFormatted
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

    static deleteOne(orderId)
    {
        const db = getDb();

        let deleteSuccessful = 1;
        let deleteFailed = 0;

        return db.collection("orders")
            .deleteOne({_id: ObjectId(orderId)})
            .then(result => {
                if(result.deletedCount == deleteSuccessful)
                {
                    console.log('order document ' + orderId + ' deleted successful');
                    return deleteSuccessful;
                } 
                else
                {
                    console.log('order document ' + orderId + ' deleted failed');
                    return deleteFailed;
                } 
            })
            .catch(err => console.log(err));
    }

    static fetchAll()
    {
        const db = getDb();

        return db
            .collection("orders")
            .find()
            .toArray()
            .then(orders => { /* { console.log(orders) */ return orders })
            .catch(err => console.log(err));
    }

    static fetchAllUnconfirmed()
    {
        const db = getDb();

        return db
            .collection("orders")
            .find({status: "unconfirmed"})
            .toArray()
            .then(orders => { /* { console.log(orders) */ return orders })
            .catch(err => console.log(err));
    }

    static fetchAllConfirmed()
    {
        const db = getDb();

        return db
            .collection("orders")
            .find({status: "confirmed"})
            .toArray()
            .then(orders => { /* { console.log(orders) */ return orders })
            .catch(err => console.log(err));
    }

    static fetchAllCompleted()
    {
        const db = getDb();

        return db
            .collection("orders")
            .find({status: "completed"})
            .toArray()
            .then(orders => { /* { console.log(orders) */ return orders })
            .catch(err => console.log(err));
    }
}

module.exports = Order;