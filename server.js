var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/assets', express.static(__dirname + '/assets'));

server.listen('80', function() {
    console.log('Listening on ' + server.address().port);
});

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

