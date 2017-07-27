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
var food = [];
var top_id = 1;
var top_food = 1;

var constants = {
    defaultSpeed: 5,
    defaultRadius: 68,
    radiusIncr: 4,
    renderPeriod: 20,
    supplyPeriod: 20000,
    maxFood: 100,
    maxHeight: 3000,
    maxWidth: 3000,
    foodSize: 8,
    foodSpeed: 3,
    angleRate: 3000
};

setInterval(render, constants.renderPeriod);
supplyFood();
setInterval(supplyFood, constants.supplyPeriod);

io.on('connect', function(socket){
    var body = new models.RigidBody(top_id, 1, randInt(100, 500), randInt(100, 500), constants.defaultSpeed, 0, constants.defaultRadius);
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

    socket.on('stop', function(){
        this_player.body.stopping = true;
    });

    socket.on('start', function(){
        this_player.body.stopping = false;
    });

    var counter = 0;
    socket.on('catch', function(){
        if (counter != 0)
            return;
        var goCatch = setInterval(function(){
            if (counter >= 4*constants.defaultRadius) {
                counter = 0;
                clearInterval(goCatch);
            } else {
                counter += 1;
                if (counter > 2*constants.defaultRadius) {
                    this_player.body.distance = 4*constants.defaultRadius - counter;
                } else {
                    this_player.body.distance = counter;
                }
            }
        }, constants.renderPeriod/2);
    });

    //setTimeout(function(){socket.emit("gameOver");console.log("over");}, 10000);
});

function render() {
    physics.run(bodies, true, false);
    physics.run(food, false, true);
    io.emit('update', {player: bodies, food: food});
};

function supplyFood() {
    var toSupply = constants.maxFood - food.length;
    for (var i = 0; i < toSupply; i++) {
        food.push(new models.RigidBody(top_food, 1, randInt(0, constants.maxWidth), randInt(0, constants.maxHeight),constants.foodSpeed, randAngle(), constants.foodSize));
        top_food++;
    }
};

function randInt(a, b) {
    var r = Math.random();
    return Math.floor(r*(b-a)+a);
};

function randAngle() {
    return Math.random()*Math.PI*2;
}