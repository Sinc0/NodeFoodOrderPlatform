//imports
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const helmet = require('helmet');
const ws = require('ws').Server;

//files
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random() + '-' + file.originalname);
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    {
        cb(null, true);
    }

    else
    {
        cb(null, false);
    }
};

//internal
const adminRoutes = require('./routes/admin.js');
const userRoutes = require('./routes/user.js');
const rootDir = require('./helpers/path.js'); //shortcut to root directory
const userController = require('./controllers/user.js');
const errorController = require('./controllers/error');
const User = require('./models/user');
const Session = require('./models/session');
const Restaurant = require('./models/restaurant');
const Order = require('./models/order.js');
const mongoConnect = require('./helpers/database').mongoConnect;
const app = express();

//secure http headers
app.use(helmet());

//set templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//makes public folder able to serve static files    
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

//parsing
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: multerStorage, fileFilter: multerFilter}).single('image'));

//routes
app.use('/', (req, res, next) => {
    //console.log('This always runs!');
    next();
});
app.use(adminRoutes);
app.use(userRoutes);

//controllers
app.use(errorController.get404ErrorPage);

//db and websocket connection
mongoConnect(() => {

    webSocket = new ws({port: 65535});
    webSocket.on('connection', function(ws, req){

    //var clientIp = req.socket.remoteAddress;
    //var clientKey = req.headers['sec-websocket-key'];

    //console.log("client " + clientKey + " connected");

    console.log("number of clients:", webSocket.clients.size);
    
    ws.on('message', function(message) {
        //console.log("\nmessage recieved: " + message);
        //ws.send("response message");
        //ws.close();
        
        webSocket.clients.forEach(function event(client){
            //console.log(client);
            client.send(message);
            //client.send("another message");
            //client.close();
        });
    });
});

    //start
    app.listen(process.env.PORT || 3000);
    //console.log(process.env);

    //******* test area below *******

    //Order.fetchAll();
    //Order.deleteOne('5ee8fdc204550299110cef58');
    //Order.FindByUser('andersson@mail.com')
    //Order.findById('5ee755d867fa4b4d5dfd4734');
    //Order.updateOne('5f3673e095408d19ee244ea4', "15 min");
    //Order.findById("5f3d20a18b452d3ffee4353c", "orders");
    //Order.fetchAllUnconfirmed("akosdmks").then(orders => {console.log(orders)});
    //Restaurant.findById('5ebeac773c4721f4f1ca4369');
    //Restaurant.delete('5ebeaa2052e60df379eb3d1d');
    //User.emptyCart('andersson@mail.com');
    //User.fetchCart('andersson@mail.com');
    //User.findById('5ecbe168d0e1f9d4753f5fd5');
    //User.findByEmail('bill@mail.com');
    //User.findByCookieId(0.6455338872058423);
    //User.validateLogin(0.9769220100073956);
    //Session.deleteOne(0.20029134749794464);
    //Session.findByCookieId(0.9769220100073956);
    //Session.createSession('jokka@mail.com', '123456', 0.128931032330131, true);
    //User.deleteOne('ham@mail.com');
    //User.updateOne('jokka@mail.com', 0.1317381373812)
    //const testUser = new User('test@email.com', 'testAccount', '123456');
    //testUser.save();
    //User.findById('5ecbe168d0e1f9d4753f5fd5');
    //User.fetchAll();
});