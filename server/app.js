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
var bodies = [];
var top_id = 1;

io.on('connect', function(socket){
    var body = new models.RigidBody(top_id, 1, randInt(100, 500), randInt(100, 500), 5, 0, 64);
    var this_player = new models.Player(top_id, socket, body);
    players.push(this_player);
    top_id++;
    bodies = players.map(function(x){return x.body});
    setTimeout(function(){socket.emit("loadComplete", this_player.id);console.log(this_player.id + " joins game.");}, 1000);

    socket.on('action', function(action){
        if (action === 'L') {
            this_player.body.set_angle(Math.PI);
        } else if (action == 'R') {
            this_player.body.set_angle(0);
        } else if (action == 'U') {
            this_player.body.set_angle(Math.PI*3/2);
        } else if (action == 'D') {
            this_player.body.set_angle(Math.PI/2);
        }
        socket.broadcast.emit('update', bodies);
    });

    socket.on('turnTo', function(angle){
        this_player.body.angle = angle;
        //console.log("turn to "+angle.toString());
    });

    socket.on('disconnect', function(){
        var i = players.indexOf(this_player);
        players.splice(i, 1);
        bodies = players.map(function(x){return x.body});
        console.log(this_player.id + " leaves game.");
        io.emit('leave', this_player.id);
    });

    setInterval(render, 20);

    //setTimeout(function(){socket.emit("gameOver");console.log("over");}, 10000);
});

function render() {
    physics.run(bodies);
    io.emit('update', bodies);
}

function randInt(a, b) {
    var r = Math.random();
    return Math.floor(r*(b-a+1)+a);
};