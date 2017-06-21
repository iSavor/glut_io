var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/assets', express.static(__dirname + '/assets'));

//app.get('/', function(req, res) {
//    res.sendFile(__dirname + '/index.html');
//});

server.listen('8080', function() {
    console.log('Listening on ' + server.address().port);
});

server.lastPlayderID = 0;

io.on('connection', function(socket) {
    socket.on('joinRequest', function() {
        socket.playerStruct = {
            id: server.lastPlayderID++,
            x: randomInt(0, 1920),
            y: randomInt(0, 1920),
            v: [0, 0],
            r: 0
        };
        
        socket.emit('createSelf', socket.playerStruct);
        socket.emit('allPlayers', getAllPlayerStructs(socket.playerStruct.id));
        
        
        socket.broadcast.emit('notifyNewComer', socket.playerStruct);
        //=============

        socket.on('disconnect', function() {
            io.emit('remove', socket.playerStruct.id);
        });

        socket.on('changeVelo', function(v) {
            socket.playerStruct.v = socket.playerStruct.v.map((ele, index) => ele + v[index]);
            if (socket.playerStruct.v[0] > 200) {
                socket.playerStruct.v[0] = 200;
            } else if (socket.playerStruct.v[0] < -200) {
                socket.playerStruct.v[0] = -200;
            }
            if (socket.playerStruct.v[1] > 200) {
                socket.playerStruct.v[1] = 200;
            } else if (socket.playerStruct.v[1] < -200) {
                socket.playerStruct.v[1] = -200;
            }
            socket.broadcast.emit('updatePosOf', socket.playerStruct);
            socket.emit('updateSelfVelo', socket.playerStruct);
        });

        socket.on('slowDown', function() {
            if (socket.playerStruct.v[0] != 0) {
                if (socket.playerStruct.v[0] > 0) {
                    socket.playerStruct.v[0] -= 10;
                } else {
                    socket.playerStruct.v[0] += 10;
                }
            }
            if (socket.playerStruct.v[1] != 0) {
                if (socket.playerStruct.v[1] > 0) {
                    socket.playerStruct.v[1] -= 10;
                } else {
                    socket.playerStruct.v[1] += 10;
                }
            }
            socket.broadcast.emit('updatePosOf', socket.playerStruct);
            socket.emit('updateSelfVelo', socket.playerStruct);
        });
        
        socket.on('broadcastSelfPos', function (data) {
            socket.broadcast.emit('updatePosOf', socket.playerStruct);
        });
        
        // Rot add
        socket.on('updateAndBroadcastSelfStructPos', function (data) {
            socket.playerStruct.x = data.x;
            socket.playerStruct.y = data.y;
            socket.playerStruct.r = data.r;
            socket.broadcast.emit('updatePosOf', socket.playerStruct);
        })
    });
});

function getAllPlayerStructs(id) {
    var playerStructs = [];
    Object.keys(io.sockets.sockets).forEach(function (socketID) {
        var aPlayerStruct = io.sockets.sockets[socketID].playerStruct;
        if (aPlayerStruct) {
            if (aPlayerStruct.id === id || aPlayerStruct.x === undefined) {
                return;
            }
            playerStructs.push(aPlayerStruct);
        }
    });
    return playerStructs;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var hbs = require('express-handlebars');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
var db = mongoose.connection;
db.on('error', function() {});
db.once('open', function() {});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

require('./config/passport')(passport);

app.set('view engine', 'ejs');


app.use(session({
    secret: 'crazy_omg_what_i_have_done'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/router.js')(app, passport);
