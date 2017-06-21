var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var game;
var cursors;
var Game = {};


Game.local = {
    actor: null,
    id: -1
};

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
}

Game.preload = function() {

    game.load.image('background', 'assets/background.png');
    game.load.image('player', 'assets/upper.png');
    game.load.image('mouth', 'assets/lower.png');
    game.load.image('food', 'assets/food.png');
    console.log('preloaded');
};

Game.create = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    Game.local.actor = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
    Game.local.actor.anchor.setTo(0.5);

    //  And enable the Sprite to have a physics body:
    game.physics.arcade.enable(Game.local.actor);

    Game.playerMap = {};
    var background = game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.world.setBounds(0, 0, 1920, 1920);
    Client.requestJoinGame();
    console.log('created');
    
    //P2JS Physics
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 1.0;
    
    
    // Use arcade instead
    foods = game.add.group();
    foods.enableBody = true;
    Game.generateFood();

    // mouth 
    Game.local.mouth = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
    game.physics.arcade.enable(Game.local.mouth);
    Game.local.mouth.anchor.setTo(0.5, 0.5);
    Game.mouthMap = {};

}

Game.update = function() {
    Client.slowDown();

    //rotation
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

    if (Game.local.actor) {
        //Client.broadcastSelfPos(Game.local.actor.body.position.x, Game.local.actor.body.position.y, Game.local.actor.rotation);
        Client.broadcastSelfPos(Game.local.actor.x, Game.local.actor.y, Game.local.actor.rotation);
    }


    for (var key in Game.playerMap) {
        console.log("Before: " + Game.mouthMap[key].rotation);
        Game.mouthMap[key].rotation = Game.playerMap[key].rotation;
        console.log("After: " + Game.mouthMap[key].rotation);
        var theta = Game.mouthMap[key].rotation;
        //var tempx = Game.playerMap[key].centerX + Math.cos(theta)*68;
        //var tempy = Game.playerMap[key].centerY + Math.sin(theta)*68;
        var tempx = Game.playerMap[key].x + Math.cos(theta)*68;
        var tempy = Game.playerMap[key].y + Math.sin(theta)*68;
        Game.mouthMap[key].x = tempx;
        Game.mouthMap[key].y = tempy;
        //Game.mouthMap[key].centerX = tempx;
        //Game.mouthMap[key].centerY = tempy;
    }

    // //mouth to head angle
    // Game.local.mouth.rotation = Game.local.actor.rotation;
    // //mouth to point 
    
    // var theta = Game.local.mouth.rotation;
    // var tempx = Game.local.actor.centerX + Math.cos(theta)*68
    // var tempy = Game.local.actor.centerY + Math.sin(theta)*68
 
    // // debugger;
    // // game.physics.arcade.moveToXY(Game.local.mouth,tempx,tempy,300);
    // Game.local.mouth.centerX = tempx;
    // Game.local.mouth.centerY = tempy;


    
    
//    for (var key in Game.playerMap) {
//        allPlayers.push(Game.playerMap[key]);
//    }
    game.physics.arcade.collide(allPlayers, allPlayers);
    
    game.physics.arcade.collide(allPlayers, foods);


}





Game.render = function(){
    if (!Game.local.actor) {
       return;
    }
    game.debug.spriteInfo(Game.local.actor, 32, 32);
}

// Rot add
Game.createSelfPlayer = function (id, x, y, v, r) {
    Game.local.actor = game.add.sprite(x, y, 'player');
    Game.local.id = id;
    Game.playerMap[id] = Game.local.actor;
    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.local.actor.body.velocity.x = v[0];
    Game.local.actor.body.velocity.y = v[1];
    Game.local.actor.rotation = r;
    
    Game.local.actor.body.collideWorldBounds = true;
    
    game.camera.follow(Game.local.actor);
    //Game.setCam(Game.local.actor);
    Game.local.actor.anchor.setTo(0.5, 0.5);
    
    allPlayers.push(Game.local.actor);


    //mouth
    Game.local.mouth = game.add.sprite(x-64, y, 'mouth');
    Game.mouthMap[id] = Game.local.mouth;
    game.physics.enable(Game.mouthMap[id], Phaser.Physics.ARCADE);
    
    
    Game.local.mouth.x = x + Math.cos(r) * 68;
    Game.local.mouth.y = y + Math.sin(r) * 68;
    //Game.local.mouth.body.velocity.x = v[0];
    //Game.local.mouth.body.velocity.y = v[1];

    Game.local.mouth.body.collideWorldBounds = true;
    
    Game.local.mouth.anchor.setTo(0.5, 0.5);
    

}

// Rot add
Game.addNewPlayer = function(id, x, y, v, r) {
    Game.playerMap[id] = game.add.sprite(x, y, 'player');
    
    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    
    // ?????
    Game.playerMap[id].body.velocity.x = v[0];
    Game.playerMap[id].body.velocity.y = v[1];
    Game.playerMap[id].rotation = r;
    
    Game.playerMap[id].body.collideWorldBounds = true;
    
    allPlayers.push(Game.playerMap[id]);



    //mouth

    Game.mouthMap[id] = game.add.sprite(x, y, 'mouth');
    game.physics.enable(Game.mouthMap[id], Phaser.Physics.ARCADE);
    //Game.mouthMap[id].rotation = r;
    Game.mouthMap[id].anchor.setTo(0.5, 0.5);
    
//    Game.mouthMap[id].rotation = r;
//    var theta = Game.mouthMap[key].rotation;
//    var tempx = Game.playerMap[key].centerX + Math.cos(theta)*68;
//    var tempy = Game.playerMap[key].centerY + Math.sin(theta)*68;
//    Game.mouthMap[key].centerX = tempx;
//    Game.mouthMap[key].centerY = tempy;
    
    //Game.mouthMap[id].x = x + Math.cos(r) * 68;
    //Game.mouthMap[id].y = y + Math.sin(r) * 68;
    //Game.mouthMap[id].body.velocity.x = v[0];
    //Game.mouthMap[id].body.velocity.y = v[1];
    
    Game.mouthMap[id].body.collideWorldBounds = true;
    
    
    
    
    allPlayers.push(Game.mouthMap[id]);


};

Game.setCam = function(actor){
    game.camera.follow(actor);
}

Game.removePlayer = function(id) {
    // Remove reference from array "allPlayers"
    var index = allPlayers.indexOf(Game.playerMap[id]);
    if (index >= 0) {
        allPlayers.splice(index, 1);
    }
    index = allPlayers.indexOf(Game.mouthMap[id]);
    if (index >= 0) {
        allPlayers.splice(index, 1);
    }
    
    Game.playerMap[id].destroy();
    Game.mouthMap[id].destroy();
    delete Game.playerMap[id];
    delete Game.mouthMap[id];
};

Game.moveSelfPlayer = function(player) {
    if (!(player.id in Game.playerMap)) {
        return;
    }
    //Game.playerMap[player.id].body.velocity.x = player.v[0];
    //Game.playerMap[player.id].body.velocity.y = player.v[1];
}

// Rot Add
Game.moveOtherPlayer = function(player) {
    if (! Game.playerMap) {
        return;
    }
    if (!(player.id in Game.playerMap)) {
        return;
    }
    Game.playerMap[player.id].x = player.x;
    Game.playerMap[player.id].y = player.y;
    Game.playerMap[player.id].rotation = player.r;
}

Game.generateFoodOnce = function (amt) {
    // Max 200 food pieces
    if (foods.length >= 200) {
        return;
    }
    for (var i = 0; i < amt; i++) {
        var f = foods.create(game.world.randomX, game.world.randomY, 'food');
        f.body.collideWorldBounds = true;
        f.body.bounce.set(1);
        //f.body.setCircle(10);
        f.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
        //Game.randomInt(0, 1920);
    }
};

Game.generateFood = function() {
    Game.generateFoodOnce(20);
    setTimeout(function() {
        Game.generateFood();
    }, 1000);
}