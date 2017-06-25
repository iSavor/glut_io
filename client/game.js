var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'glut');

var face;
var texture;

var states = {
	load: function() {
	    this.preload = function() {
	        game.load
            game.load.image('face', 'assets/player.png');
        };
	    this.create = function() {
            game.input.mouse.capture = true;
            face = game.make.sprite(0, 0, 'face');
            texture = game.add.renderTexture(20, 20);
            game.add.sprite(0, 0, texture);

            game.stage.backgroundColor = 0x808080;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Loading", style);
            text.anchor.setTo(0, 0.5);
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
	    this.render = function() {
	        texture.renderXY(face, 100, 200, true);
        }
	},
	login: function() {
        this.create = function() {
            game.stage.backgroundColor = 0xff0000;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Log in", style);
            text.anchor.setTo(0, 0.5);
            setTimeout(function(){game.state.start("play")}, 1000);
        }
	},
	play: function() {
        this.create = function() {
            game.stage.backgroundColor = 0xf0ff00;
        };
        this.render = function() {
            for (var player of players) {
                console.log(player.position.x, player.position.y);
                texture.renderXY(face, player.position.x, player.position.y, true);
            }
            if (signals.over) {
                signals.over = false;
                game.state.start('over');
            }
            setTimeout(function(){producer.enqueue(new msg('action', 'L'))}, 1000);
        }
	},
	over: function() {
        this.create = function() {
            game.stage.backgroundColor = 0x000000;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Click to play again", style);
            text.anchor.setTo(0.5, 0.5);
        };
        this.render = function() {
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