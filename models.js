module.exports = {
	rigid_body: rigid
};

function vector(x, y) {
	this.x = x;
	this.y = y;
}

function rigid(id, weight, x, y, vx, vy, fx, fy) {
	this.id = id;
	this.weight = weight;
	this.position = new vector(x, y);
	this.v = new vector(vx, vy);
	this.F = new vector(fx, fy);
	//rotation???
}