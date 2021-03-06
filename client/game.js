var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'glut');

var sprites = {};
var teeth = {};
var foodSprites = {};
var my_id = -1;
var my_player = null;
var camera_set = false;

var states = {
	load: function() {
	    this.preload = function() {
            game.load.image('face', 'assets/player.png');
            game.load.image('teeth', 'assets/teeth.png');
            game.load.image('background', 'assets/tiles.jpg');
            game.load.image('food', 'assets/food.png');
        };
	    this.create = function() {
            game.input.mouse.capture = true;
            game.world.setBounds(0, 0, 3000, 3000);

            game.stage.backgroundColor = 0x808080;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Loading", style);
            text.anchor.setTo(0, 0.5);
            text.fixedToCamera = true;
            text.cameraOffset.setTo(400, 300);
            var i = 0;
            var animation = setInterval(function(){
                i = (i + 1) % 6;
                text.setText("Loading"+'.'.repeat(i));
                if (signals.loadComplete) {
                    console.log("complete");
                    clearInterval(animation);
                    game.state.start("login");
                }
            }, 500);
        };
	},
	login: function() {
        this.create = function() {
            game.stage.backgroundColor = 0xff0000;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Log in", style);
            text.anchor.setTo(0, 0.5);
            text.fixedToCamera = true;
            text.cameraOffset.setTo(400, 300);
            setTimeout(function(){game.state.start("play")}, 1000);
        }
	},
	play: function() {
        this.create = function() {
            //game.stage.backgroundColor = 0x808080;
            game.add.tileSprite(0, 0, 3000, 3000, 'background');
            setInterval(function(){
                var x_diff = game.input.worldX - sprites[my_id].x;
                var y_diff = game.input.worldY - sprites[my_id].y;
                var angle = Math.atan(y_diff/x_diff);
                if (angle < 0) angle += Math.PI;
                if (y_diff < 0) {
                    angle += Math.PI;
                }
                //game.debug.text(angle.toString()+"\n"+x_diff.toString()+"\n"+y_diff.toString(), 100, 100);
                //producer.enqueue(new msg('turnTo', angle));
                socket.emit('turnTo', angle);
            }, 100);
            game.input.onDown.add(function(){
                socket.emit('catch');
            }, this);
        };
        this.render = function() {
            for (var player of players) {
                if (player.id in sprites) {
                    sprites[player.id].x = player.position.x;
                    sprites[player.id].y = player.position.y;
                    sprites[player.id].angle = player.angle/Math.PI*180;
                    console.log(player.radius, player.distance);
                    teeth[player.id].x = player.position.x + Math.cos(player.angle)*(player.radius+player.distance);
                    teeth[player.id].y = player.position.y + Math.sin(player.angle)*(player.radius+player.distance);
                    teeth[player.id].angle = player.angle/Math.PI*180;

                } else {
                    sprites[player.id] = game.add.sprite(player.position.x, player.position.y, 'face');
                    sprites[player.id].height = player.radius*2;
                    sprites[player.id].width = player.radius*2;
                    sprites[player.id].anchor.setTo(0.5, 0.5);
                    sprites[player.id].inputEnabled = true;
                    teeth[player.id] = game.add.sprite(player.position.x, player.position.y, 'teeth');
                    teeth[player.id].height = player.radius*2;
                    teeth[player.id].width = player.radius/2;
                    teeth[player.id].anchor.setTo(0.5, 0.5);
                }
            }
            for (var item of food) {
                if (item.id in foodSprites) {
                    foodSprites[item.id].x = item.position.x;
                    foodSprites[item.id].y = item.position.y;
                    foodSprites[item.id].angle = item.angle/Math.PI*180;

                } else {
                    foodSprites[item.id] = game.add.sprite(item.position.x, item.position.y, 'food');
                    foodSprites[item.id].height = item.radius*2;
                    foodSprites[item.id].width = item.radius*2;
                    foodSprites[item.id].anchor.setTo(0.5, 0.5);
                }
            }
            if (! camera_set) {
                my_player = sprites[my_id];
                my_player.events.onInputOver.add(function(){
                    socket.emit('stop');
                }, this);
                my_player.events.onInputOut.add(function(){
                    socket.emit('start');
                }, this);
                game.camera.follow(my_player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
                camera_set = true;
            }
            if (signals.over) {
                signals.over = false;
                game.state.start('over');
            }
            /*
            if (my_player.input.pointerOver() && !pointerOver) {
                pointerOver = true;
                socket.emit('stop');
            } else if (!my_player.input.pointerOver() && pointerOver) {
                pointerOver = false;
                socket.emit('start');
            }*/
        }
	},
	over: function() {
        this.create = function() {
            game.stage.backgroundColor = 0x000000;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Click to play again", style);
            text.anchor.setTo(0.5, 0.5);
        };
        this.update = function() {
            if (game.input.activePointer.leftButton.isDown) {
                game.state.start('play');
            }
        }
	}
}

for(var key in states) {
	game.state.add(key, states[key]);
}

game.state.start('load');