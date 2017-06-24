"use strict";

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var models = require('./models');
var physics = require('./physics');

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/assets', express.static(__dirname + '/assets'));

server.listen('8080', function() {
    console.log('Listening on ' + server.address().port);
});

var players = [];
var top_id = 1;

io.on('connect', function(socket){
    var body = new models.RigidBody(top_id, 1, randInt(100, 500), randInt(100, 500), 0, 0, 1, 0, 0);
    var this_player = new models.Player(top_id, socket, body);
    players.push(this_player);
    top_id++;
    setTimeout(function(){socket.emit("loadComplete");console.log("complete");}, 10000);

    socket.on('action', function(action){
        if (action === 'L') {
            this_player.body.apply(new models.Vector(-1, 0), 0);
        } else if (action == 'R') {
            this_player.body.apply(new models.Vector(1, 0), 0);
        } else if (action == 'U') {
            this_player.body.apply(new models.Vector(0, -1), 0);
        } else if (action == 'D') {
            this_player.body.apply(new models.Vector(0, 1), 0);
        }
        var client_players = players.map(function(obj){return obj.body});
        socket.broadcast.emit('update', client_players);
    });

    socket.on('disconnect', function(){
        var i = players.indexOf(this_player);
        players.splice(i, 1);
        console.log(players);
    });

    setTimeout(function(){socket.emit("gameOver");console.log("over");}, 10000);
});

function randInt(a, b) {
    var r = Math.random();
    return Math.floor(r*(b-a+1)+a);
};