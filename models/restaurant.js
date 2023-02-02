//imports
const getDb = require('../controllers/database').getDb
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId


class Restaurant 
{
    constructor(title, price, description, imageUrl, owner) 
    {
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
        this.owner = owner
    }


    save() 
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('restaurants')
                .insertOne(this)
                .then(/* result => console.log(result) */)
                .catch(err => console.log(err))
    }


    static update(restaurantId, url, title, open, status, hours, description, image, menuCategories, menuItems, rating, type, location) 
    {
        //get db
        const db = getDb() 

        //update db
        return db
                .collection('restaurants')
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
                .then(result => { return result })
                .catch(err => console.log(err))
    }

    
    static updateAdmin(restaurantId, title, email, owner, address)
    {       
        //get db
        const db = getDb()

        //variables
        let updateSuccessful = 1
        let updateFailed = 0
        let dateObject = new Date().toString()
        let sub1 = dateObject.substring(16, 24)
        let sub2 = dateObject.substring(0, 15)
        let dateFormatted = sub1 + " - " + sub2

        //update db
        return db
                .collection("restaurants")
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
                    if(result.modifiedCount == updateSuccessful) { return updateSuccessful } 
                    else { return updateFailed }
                })
                .catch(err => console.log(err))
    }


    static updateMenu(owner, hours, description, imageUrl, menuCategories, menuItems, phone, address, types, city) 
    {
        //get db
        const db = getDb()   

        //update db
        return db
                .collection('restaurants')
                .updateOne({email: owner},{$set: 
                    {
                        imageUrl: imageUrl,
                        hours: hours,
                        description: description,
                        menuCategories: menuCategories,
                        menuItems: menuItems,
                        phone: phone,
                        address: address,
                        type: types,
                        city
                    }
                }  )
                .then(result => { return result })
                .catch(err => console.log(err))
    }


    static menuListed(owner, value) 
    {
        //get db
        const db = getDb()   

        //update db
        return db
                .collection('restaurants')
                .updateOne({email: owner},{$set: { menuListed: value }})
                .then(result => { return result })
                .catch(err => console.log(err))
    }


    static menuOnline(owner, value) 
    {
        //get db
        const db = getDb()   

        //update db
        return db
                .collection('restaurants')
                .updateOne({email: owner},{$set: { open: value, menuOnline: value }})
                .then(result => { return result })
                .catch(err => console.log(err))
    }


    static welcomeMessage(owner, value) 
    {
        //get db
        const db = getDb()   

        //update db
        return db.collection('restaurants')
            .updateOne({email: owner},{$set: { welcomeMessage: value }})
            .then(result => { return result })
            .catch(err => console.log(err))
    }


    static deleteOne(restaurantId)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('restaurants')
                .deleteOne({_id: ObjectId(restaurantId)})
                .then(result => { return result.deletedCount })
                .catch(err => console.log(err))
    }


    static fetchAll()
    {
        //get db
        const db = getDb()
        
        //update db
        return db
                .collection('restaurants')
                .find()
                .toArray()
                .then(restaurants => { return restaurants })
                .catch(err => console.log(err))
    }


    static findById(prodId)
    {
        //get db
        const db = getDb()

        //update db
        return db
            .collection('products')
            .findOne({_id: ObjectId(prodId)})
            .then(product => {
                if(product != null) { return product }
                else { return null }})
            .catch(err => console.log(err))
    }


    static findByUrl(url)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('restaurants')
                .findOne({url: url})
                .then(restaurant => {
                    if(restaurant != null) { return restaurant }
                    else { return null }})
                .catch(err => console.log(err))
    }


    static findByEmail(email)
    {
        //get db
        const db = getDb()

        //update db
        return db
                .collection('restaurants')
                .findOne({email: email})
                .then(restaurant => {
                    if(restaurant != null) { return restaurant }
                    else { return null }})
                .catch(err => console.log(err))
    }
}


//exports
module.exports = Restaurant