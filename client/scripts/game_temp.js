var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var game;
var cursors;
var Game = {};

//We treat food as local
var foods;
var allPlayers = [];

function login() {
    gameInit();
}

function gameInit() {
    game = new Phaser.Game(width, height, Phaser.AUTO, document.getElementById('game'));
    game.state.add('Game', Game);
    game.state.start('Game');
}

Game.init = function() {
    //game.state.disableVisibilityChange = true;
    cursors = game.input.keyboard.createCursorKeys();
};

Game.preload = function() {
    game.load.image('background', 'assets/background.png');
    game.load.image('player', 'assets/player.png');
    game.load.image('food', 'assets/food.png')
    console.log('preloaded');
};

Game.create = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    Game.local.actor = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
    Game.local.actor.anchor.set(0.5);

    //  And enable the Sprite to have a physics body:
    game.physics.arcade.enable(Game.local.actor);

    Game.playerMap = {};
    
    var background = game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.world.setBounds(0, 0, 1920, 1920);
    Client.requestJoinGame();
    console.log('created');
    
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 1.0;
    foods = game.add.group();
    foods.enableBody = true;
    foods.physicsBodyType = Phaser.Physics.P2JS;
    Game.generateFood();
};

Game.update = function() {
    Client.slowDown();

    if (!Game.local.actor) {
       return;
    }
    Game.local.actor.rotation = game.physics.arcade.angleToPointer(Game.local.actor);
    

    //follow
    if (game.physics.arcade.distanceToPointer(Game.local.actor, game.input.activePointer) > 8) {
        //  Make the object seek to the active pointer (mouse or touch).
        game.physics.arcade.moveToPointer(Game.local.actor, 300);
    } else {
        //  Otherwise turn off velocity because we're close enough to the pointer
        Game.local.actor.body.velocity.set(0);
    }
    
    game.physics.arcade.collide(allPlayers, allPlayers);
    
    if (Game.local.actor) {
        Client.broadcastSelfPos(Game.local.actor.body.position.x, Game.local.actor.body.position.y);
    }

    var allPlayers = [];
    for (var key in Game.playerMap) {
        allPlayers.push(Game.playerMap[key]);
    }
};

Game.local = {
    actor: null,
    id: -1
};

Game.render = function(){
    if (!Game.local.actor)
    {
       return;
    }
    game.debug.spriteInfo(Game.local.actor, 32, 32);
};

Game.createSelfPlayer = function (id, x, y, v) {
    Game.local.actor = game.add.sprite(x, y, 'player');
    Game.local.id = id;
    Game.playerMap[id] = Game.local.actor;
    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.local.actor.body.velocity.x = v[0];
    Game.local.actor.body.velocity.y = v[1];
    Game.local.actor.body.collideWorldBounds = true;
    
    game.camera.follow(Game.local.actor);
    //Game.setCam(Game.local.actor);
    Game.local.actor.anchor.setTo(0.5, 0.5);
    
    
    allPlayers.push(Game.local.actor);
};

Game.addNewPlayer = function(id, x, y, v) {
    Game.playerMap[id] = game.add.sprite(x, y, 'player');
    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.playerMap[id].body.velocity.x = v[0];
    Game.playerMap[id].body.velocity.y = v[1];
    Game.playerMap[id].body.collideWorldBounds = true;
    
    allPlayers.push(Game.playerMap[id]);
};

Game.setCam = function(actor){
    game.camera.follow(actor);
};

Game.removePlayer = function(id) {
    allPlayers.remove(Game.playerMap[id]);
    
    
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.moveSelfPlayer = function(player) {
    if (!(player.id in Game.playerMap)) {
        return;
    }
    //Game.playerMap[player.id].x = player.x;
    //Game.playerMap[player.id].y = player.y;
    
    //Game.playerMap[player.id].body.velocity.x = player.v[0];
    //Game.playerMap[player.id].body.velocity.y = player.v[1];
};

Game.moveOtherPlayer = function(player) {
    if (! Game.playerMap) {
        return;
    }
    if (!(player.id in Game.playerMap)) {
        return;
    }
    Game.playerMap[player.id].x = player.x;
    Game.playerMap[player.id].y = player.y;
};

Game.generateFoodOnce = function (amt) {
//    var randomInt = function (low, high) {
//        return Math.floor(Math.random() * (high - low) + low);
//    };
    // Max 200 food pieces
    if (foods.length >= 200) {
        return;
    }
    for (var i = 0; i < amt; i++) {
        var f = foods.create(game.world.randomX, game.world.randomY, 'food');
        //f.body.collideWorldBounds = true;
        //f.body.bounce.set(1);
        f.body.setCircle(10);
        //f.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
        //Game.randomInt(0, 1920);
    }
};

Game.generateFood = function() {
    Game.generateFoodOnce(20);
    setTimeout(function() {
        Game.generateFood();
    }, 1000);
}
