//env
const dotenv = require('dotenv')
dotenv.config();

//imports
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const ws = require('ws').Server;

//internal
const adminRoutes = require('./routes/admin.js');
const userRoutes = require('./routes/user.js');
const errorController = require('./controllers/error');
const mongoConnect = require('./controllers/database').mongoConnect;
const app = express();

//use
app.use(helmet()); //secure http headers
app.set('view engine', 'ejs'); //set templating engine
app.set('views', 'views'); //set views folder
app.use(express.static(path.join(__dirname, 'public'))); //makes public folder able to serve static files   
//app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json()); //parsing
app.use(bodyParser.raw()); //parsing
app.use(bodyParser.text()); //parsing
app.use(bodyParser.urlencoded({extended: false})); //parsing

//routes
// app.use('/', (req, res, next) => { next(); });
app.use(adminRoutes);
app.use(userRoutes);

//controllers
app.use(errorController.get404ErrorPage);

//db and websocket connection
mongoConnect(() => {
    
    webSocket = new ws({port: 65535});

    webSocket.on('connection', function(ws, req)
    {
        //var clientIp = req.socket.remoteAddress;
        //var clientKey = req.headers['sec-websocket-key'];
        //var clientCount = webSocket.clients.size;
        
        ws.on('message', function(message)
        {
            webSocket.clients.forEach(function event(client){
                client.send(message);
                //client.close();
        });
        
    });

});

//******* start app *******
//console.log(process.env);
app.listen(process.env.PORT || 3000);

});