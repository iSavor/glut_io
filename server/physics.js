"use strict";

var models = require('./models');

module.exports = {
	run: function(objs) {
		collision(objs, function(a, b) {
		    a.angle = (a.angle+Math.PI);
            b.angle = (b.angle+Math.PI);
		});
		for (var obj of objs) {
			obj.move();
		}
	}
};

/**
  * @desc calculate the distance between two points
  * @param vector $a, vector $b -- two vectors between which the distance is calculated
  * @return float distance between a and b
*/
function distance(a, b) {
	var x_diff = a.x - b.x;
	var y_diff = a.y - b.y;
	return Math.sqrt(x_diff * x_diff + y_diff * y_diff);
}

/**
  * @desc brute collision detection among an array of objects (assume all circle)
  * @param rigid_body[] $objs -- the array of rigid bodies to do collision detection
  * @param float $d -- the threshold of distance to be considered "collided"
  * @param function(a, b) $process -- the function to be applied if two bodies collide
  * @return float distance between a and b
*/
function collision(objs, process) {
	var length = objs.length;
	for (var i = 0; i < length; i++) {
		for (var j = i+1; j < length; j++) {
			if (distance(objs[i].position, objs[j].position) <= objs[i].radius+objs[j].radius) {
				process(objs[i], objs[j]);
			}
		}
	}
}