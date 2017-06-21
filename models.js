module.exports = {
	rigid_body: rigid
};

function vector(x, y) {
	this.x = x;
	this.y = y;
}

function rigid(id, weight, x, y, vx, vy, rotate, omega) {
	this.id = id;
	this.weight = weight;
	this.position = new vector(x, y);
	this.v = new vector(vx, vy);
	this.rotate = rotate;
	this.omega = omega;
}