//imports
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const ws = require('ws');
const dotenv = require('dotenv')
const errorController = require('./controllers/error')
const mongoConnect = require('./controllers/database').mongoConnect
const routes = require("./routes.js")

const app = express()

//env
dotenv.config()

//set
app.set('view engine', 'ejs') //set templating engine
app.set('views', 'views') //set views folder

//use
app.use(helmet()) //secure http headers
app.use(express.static(path.join(__dirname, 'public'))) //makes public folder able to serve static files   
app.use(bodyParser.json()) //parsing
app.use(bodyParser.raw()) //parsing
app.use(bodyParser.text()) //parsing
app.use(bodyParser.urlencoded({extended: false})) //parsing
app.use(routes) //routes
app.use(errorController.get404ErrorPage) //error page
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/', (req, res, next) => { next(); });
// app.use(adminRoutes);
// app.use(userRoutes);
// app.use(portalRoutes);

//connect db
mongoConnect(() => {})

//start app
app.listen(process.env.PORT || 3000)

//connect websocket
const webSocket = new ws.Server({server: app, port: 60000 });

webSocket.on('connection', function(socket, req)
{   
    socket.on('message', function(message) {
        webSocket.clients.forEach(function event(client) { client.send(message) /* client.close(); */ })
    })
})



//debugging
//console.log(process.env);
//var clientIp = req.socket.remoteAddress;
//var clientKey = req.headers['sec-websocket-key'];
//var clientCount = webSocket.clients.size;