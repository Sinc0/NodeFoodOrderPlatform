const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');
const Session = require('./session');
const User = require('./user');

const ObjectId = mongodb.ObjectId;

class Order 
{
    static createOrder(userEmail, productArray, totalPrice, comment)
    {
        const db = getDb()

        let insertSuccessful = 1;
    
        return db.collection('orders')
            .insertOne({
                user: userEmail,
                name: null,
                phone: null,
                address: null,
                date: Date(),
                pickUp: null,
                pickUpTime: null,
                delivery: null,
                deliveryTime: null,
                totalPrice: "$" + totalPrice,
                comment: comment,
                products: productArray
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
            .collection('orders')
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
            .collection('orders')
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

    static deleteOne(orderId)
    {
        const db = getDb();

        let deleteSuccessful = 1;
        let deleteFailed = 0;

        return db.collection('orders')
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
            .collection('orders')
            .find()
            .toArray()
            .then(orders => { /* { console.log(orders) */ return orders })
            .catch(err => console.log(err));
    }
}

module.exports = Order;