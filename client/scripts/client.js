var Client = {};
Client.socket = io.connect();

Client.requestJoinGame = function() {
    Client.socket.emit('joinRequest');
};

Client.changeVelo = function(v) {
    Client.socket.emit('changeVelo', v);
};

Client.slowDown = function() {
    Client.socket.emit('slowDown');
}

Client.broadcastSelfPos = function (x, y, r) {
    Client.socket.emit('updateAndBroadcastSelfStructPos', {x: x, y: y, r: r})
}

Client.socket.on('setCam', function(id){
	Game.setCam(id);
});

Client.socket.on('createSelf', function (struct) {
    Game.createSelfPlayer(struct.id, struct.x, struct.y, struct.v, struct.r);
});

Client.socket.on('notifyNewComer', function (struct) {
	console.log("new comer!!!");
    Game.addNewPlayer(struct.id, struct.x, struct.y, struct.v, struct.r);
});

Client.socket.on('allPlayers', function(data) {
    for (var i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y, data[i].v, data[i].r);
    }
});

Client.socket.on('remove', function(id) {
    Game.removePlayer(id);
});

Client.socket.on('updateSelfVelo', function(selfStruct) {
    Game.moveSelfPlayer(selfStruct);
});

Client.socket.on('updatePosOf', function(struct) {
    if (Game) {
        Game.moveOtherPlayer(struct);
    }
});
