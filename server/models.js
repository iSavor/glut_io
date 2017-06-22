/**
  * @desc this module is a repository for all the classes and 
  *       structures that will be used. Note, only the classes 
  *       that should be exposed will be in module.exports.
*/

/**
  * @desc encapsulation of this module
*/
module.exports = {
	rigid_body: rigid,
    vector: vector
};

/**
  * @desc a 2-D vector class
  * @param float $x, float $y -- the coordinates of this vector
*/
function vector(x, y) {
	this.x = x;
	this.y = y;
    /**
      * @desc negate this vector
      * @return vector -this
    */
    this.negate = function() {
        var result = new vector(-this.x, -this.y);
        return result;
    };
    /**
      * @desc add another vectors 
      * @param vector $other -- the vector to be added
      * @return vector this+other
    */
    this.add = function(other) {
        var result = new vector(this.x+other.x, this.y+other.y);
        return result;
    };
    /**
      * @desc minus a vector
      * @param vector $other -- the vectors to be subtracted from this
      * @return vector this-other
    */
    this.minus = function(other) {
        var result = this.add(other.negate());
        return result;
    };
    /**
      * @desc scale this vector
      * @param float $a -- the scale
      * @return vector a*this
    */
    this.scale = function(a) {
        var result = new vector(a*this.x, a*this.y);
        return result;
    };
    /**
      * @desc copy this vector (by creating a new object)
      * @return vector this (new instance)
    */
    this.copy = function() {
        var result = new vector(this.x, this.y);
        return result;
    };
}

/**
  * @desc a rigid body class
  * @param int $id -- the unique identifier
  * @param float $weight -- the weight
  * @param float $x, float $y -- the initial coordinates
  * @param float $vx, float $vy -- the initial velocity
  * @param float $inertia -- the angular inertia
  * @param float $rotate -- the initial rotation in radian
  * @param float $omega -- the initial angular velocity in radian
  * @note velocity and angular velocity are displacement by frame
*/
function rigid(id, weight, x, y, vx, vy, inertia, rotate, omega) {
	this.id = id;
	this.weight = weight;
	this.position = new vector(x, y);
	this.v = new vector(vx, vy);
    this.I = inertia;
	this.rotate = rotate;
	this.omega = omega;

    /**
      * @desc set the velocity of this object (instant change)
      * @param vector $v -- the new velocity
    */
    this.set_v = function(v) {
        this.v = v;
    };

    /**
      * @desc set the angular velocity of this object (instant change)
      * @param float $omega -- the new angular velocity
    */
    this.set_v = function(omega) {
        this.omega = omega;
    };

    /**
      * @desc apply force and torque on this object
      * @param vector $f, float $tau -- the force and torque to be applied
    */
    this.apply = function(f, tau) {
        var a = f.scale(1/this.weight);
        this.v = this.v.add(a);
        var alpha = tau/this.I;
        this.omega += alpha;
    };
    /**
      * @desc move this object by one frame
    */
    this.move = function() {
        this.position = this.position.add(this.v);
        this.rotate += this.omega;
    };
}