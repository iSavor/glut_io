"use strict";

var models = require('./models');

function randAngle() {
    return Math.random()*Math.PI*2;
}

module.exports = {
	run: function(objs, collide, noStuck) {
		if (collide) {
		    collision(objs, function(a, b) {
                if (a.v > 0) {
                    a.v = -a.v;
                }
                if (b.v > 0) {
                    b.v = -b.v;
                }
            });
        }
		for (var obj of objs) {
		    obj.accelerate();
		    if (obj.move()) {
		        if (noStuck) {
		            obj.angle = randAngle();
                }
            }
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
			if (distance(objs[i].position, objs[j].position)*2 <= objs[i].radius+objs[j].radius) {
				process(objs[i], objs[j]);
			}
		}
	}
}