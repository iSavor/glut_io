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

io.on('connect', function(socket){
	for (var i = 0; i < 5; i++) {
		players.push(new models.RigidBody(i, 0, 0, 0, 0, 0, 0, 0));
		socket.emit('update', players);
		console.log('emit');
	}
	for (var i = 0; i < 5; i++) {
		players.pop();
		socket.emit('update', players);
		console.log('emit');
	}
	setTimeout(function(){socket.emit("loadComplete");console.log("complete");}, 10000);
});