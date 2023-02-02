//imports
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@programmingprojects.cpk0g.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority&useUnifiedTopology=true`

//variables
let db

//connect to db
const mongoConnect = (callback) => {
    MongoClient
              .connect(connectionString)
              .then(client => {
                  db = client.db('nodeRestaurant')
                  callback(client)
                  console.log('Successful connection!')
              })
              .catch(err => {
                  console.log(err)
                  throw err
              })
}

//check db exists
const getDb = () => {
    if(db) { return db }
    else { throw 'Database not found!' }
}

//exports
exports.mongoConnect = mongoConnect
exports.getDb = getDb