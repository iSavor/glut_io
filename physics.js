var models = require('./models');

module.exports = {
	run: function(objs) {
		collision(objs, 5, function(a, b) {});
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
function collision(objs, d, process) {
	var length = objs.length;
	for (var i = 0; i < length; i++) {
		for (var j = i+1; j < length; j++) {
			if (distance(objs[i].position, objs[j].position) <= d) {
				process(objs[i], objs[j]);
			}
		}
	}
}