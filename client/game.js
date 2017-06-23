var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'glut');

var states = {
	preload: function() {
	    this.create = function() {
            game.stage.backgroundColor = 0x808080;
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Loading", style);
            text.anchor.setTo(0, 0.5);
            //game.load.onLoadComplete.add(function(){game.state.start("created");}, this);
            var i = 0;
            var animation = setInterval(function(){
                i = (i + 1) % 6;
                text.setText("Loading"+'.'.repeat(i));
                if (signals.loadComplete) {
                    console.log("complete");
                    clearInterval(animation);
                    game.state.start("created");
                }
            }, 500);
        }
	},
	created: function() {
        this.create = function() {
            game.stage.backgroundColor = 0xff0000;
            setTimeout(function(){game.state.start("play")}, 1000);
        }
	},
	play: function() {
        this.create = function() {
            game.stage.backgroundColor = 0xf0ff00;
            setTimeout(function(){game.state.start("over")}, 1000);
        }
	},
	over: function() {
        this.create = function() {
            game.stage.backgroundColor = 0x000000;
            setTimeout(function(){game.state.start("play")}, 1000);
        }
	}
}

for(var key in states) {
	game.state.add(key, states[key]);
}

game.state.start('preload');