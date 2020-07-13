const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class Cart
{
    constructor(products)
    {
        this.products = products;
    }
               
    save() 
    {
        const db = getDb();

        return db.collection('carts')
            .insertOne(this)
            .then(/* result => console.log(result) */)
            .catch(err => console.log(err));
    }

    static fetchAll()
    {
        const db = getDb();
        return db
            .collection('carts')
            .find()
            .toArray()
            .then(carts => {console.log(carts); return carts;})
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
}