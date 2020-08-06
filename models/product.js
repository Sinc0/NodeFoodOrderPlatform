/* const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 
'data', 
'products.json'
);

const getProductsFromFile = (callback) => {


        fs.readFile(p, (err, fileContent) => {
            
            if (err)
            {
               callback([]);
            }
            else
            {
                callback(JSON.parse(fileContent));
            }
        });
} */

const getDb = require('../helpers/database').getDb;
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');

const ObjectId = mongodb.ObjectId;
//const MongoClient = mongodb.MongoClient;

class Product 
{
    constructor(title, price, description, imageUrl) 
    {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() 
    {
        const db = getDb();

        return db.collection('products')
            .insertOne(this)
            .then(/* result => console.log(result) */)
            .catch(err => console.log(err));
    }

    static update(productId, title, price, description, imageUrl) 
    {
        const db = getDb();   

        return db.collection('products')
            .updateOne({_id: ObjectId(productId)},{$set: 
                {
                    title: title,
                    price: price,
                    description: description,
                    imageUrl: imageUrl,
                }
            }  )
            .then(result => { return result /* console.log(result) */ })
            .catch(err => console.log(err));
    }

    static delete(productId)
    {
        const db = getDb();

        return db.collection('products')
        .deleteOne({_id: ObjectId(productId)})
        .then(result => {/* console.log(result); */ return result.deletedCount })
        .catch(err => console.log(err));
    }

    static fetchAll()
    {
        const db = getDb();
        
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {/* console.log(products) */; return products;})
            .catch(err => console.log(err));
    }

    static findById(prodId)
    {
        const db = getDb();

       //TODO check if prodId characters are by the rules or else redirect
        
        return db
            .collection('products')
            .findOne({_id: ObjectId(prodId)})
            .then(product => {
                if(product != null)
                {
                    console.log(product);
                    return product;
                }

                else
                {
                    //console.log('no product found')
                    return null;
                }

            })
            .catch(err => console.log(err))
    }

    static findByUrl(url)
    {
        const db = getDb();

       //TODO check if prodId characters are by the rules or else redirect
        
        return db
            .collection('products')
            .findOne({url: url})
            .then(product => {
                if(product != null)
                {
                    console.log(product);
                    return product;
                }

                else
                {
                    //console.log('no product found')
                    return null;
                }

            })
            .catch(err => console.log(err))
    }
}

module.exports = Product;