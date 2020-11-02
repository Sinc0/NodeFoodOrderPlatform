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

class Restaurant 
{
    constructor(title, price, description, imageUrl, owner) 
    {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.owner = owner;
    }

    save() 
    {
        const db = getDb();

        return db.collection('restaurants')
            .insertOne(this)
            .then(/* result => console.log(result) */)
            .catch(err => console.log(err));
    }

    static update(restaurantId, url, title, open, status, hours, description, image, menuCategories, menuItems, rating, type, location) 
    {
        const db = getDb();   

        return db.collection('restaurants')
            .updateOne({_id: ObjectId(restaurantId)},{$set: 
                {
                    url: url, 
                    image: image,
                    title: title,
                    open: open,
                    status: status,
                    hours: hours,
                    description: description,
                    menuCategories: menuCategories,
                    menuItems: menuItems,
                    rating: rating,
                    type: type,
                    location: location
                }
            }  )
            .then(result => { return result /* console.log(result) */ })
            .catch(err => console.log(err));
    }

    
    static updateAdmin(restaurantId, title, email, owner, address)
    {       
        const db = getDb();

        let updateSuccessful = 1;
        let updateFailed = 0;
        
        var dateObject = new Date().toString();
        var sub1 = dateObject.substring(16, 24);
        var sub2 = dateObject.substring(0, 15);
        var dateFormatted = sub1 + " - " + sub2;

        return db.collection("restaurants")
            .updateOne({_id: ObjectId(restaurantId)},         
                {$set: 
                {
                    title: title,
                    email: email,
                    owner: owner,
                    address: address,
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

    static updateMenu(owner, hours, description, imageUrl, menuCategories, menuItems, phone, address, types) 
    {
        const db = getDb();   

        return db.collection('restaurants')
            .updateOne({email: owner},{$set: 
                {
                    imageUrl: imageUrl,
                    hours: hours,
                    description: description,
                    menuCategories: menuCategories,
                    menuItems: menuItems,
                    phone: phone,
                    address: address,
                    type: types
                }
            }  )
            .then(result => { return result /* console.log(result) */ })
            .catch(err => console.log(err));
    }

    static menuListed(owner, value) 
    {
        const db = getDb();   

        return db.collection('restaurants')
            .updateOne({email: owner},{$set: 
                {
                    menuListed: value
                }
            }  )
            .then(result => { return result /* console.log(result) */ })
            .catch(err => console.log(err));
    }

    static menuOnline(owner, value) 
    {
        const db = getDb();   

        return db.collection('restaurants')
            .updateOne({email: owner},{$set: 
                {
                    open: value,
                    menuOnline: value
                }
            }  )
            .then(result => { return result /* console.log(result) */ })
            .catch(err => console.log(err));
    }

    static welcomeMessage(owner, value) 
    {
        const db = getDb();   

        return db.collection('restaurants')
            .updateOne({email: owner},{$set: 
                {
                    welcomeMessage: value
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
            .collection('restaurants')
            .find()
            .toArray()
            .then(restaurants => {/* console.log(products) */; return restaurants;})
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
            .collection('restaurants')
            .findOne({url: url})
            .then(restaurant => {
                if(restaurant != null)
                {
                    //console.log(restaurant);
                    return restaurant;
                }

                else
                {
                    //console.log('no product found')
                    return null;
                }

            })
            .catch(err => console.log(err))
    }

    static findByEmail(email)
    {
        const db = getDb();

       //TODO check if prodId characters are by the rules or else redirect
        
        return db
            .collection('restaurants')
            .findOne({email: email})
            .then(restaurant => {
                if(restaurant != null)
                {
                    //console.log(restaurant);
                    return restaurant;
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

module.exports = Restaurant;