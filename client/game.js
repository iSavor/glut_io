var game = new Phaser.Game(600, 600, Phaser.AUTO, '#game');

var states = {
	preload: function() {
		
	},
	created: function() {

	},
	play: function() {

	},
	over: function() {

	}
}

for(key in states) {
	game.state.add(key, states[key]);
}

game.state.start('preload');