"use strict";

/**
  * @desc this module is a repository for all the classes and 
  *       structures that will be used. Note, only the classes 
  *       that should be exposed will be in module.exports.
*/

/**
  * @desc a 2-D vector class
  * @param float $x, float $y -- the coordinates of this vector
*/
class Vector {
    /**
     * @desc constructor of the vector class
     * @param x
     * @param y
     * @param optional isPoint (differentiate vector and point) (default should be false)
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * KSM: HIGHLIGHTS
     * copy(), negated(), etc. has been moved to child classes, due to trouble with "this" value
     * this problem has been tested, as the original (new Direction).copy() instanceof Vector but not Direction
     */

    /**
     * @desc negate this vector
     * @return vector -this
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    /**
     * @desc add another vectors
     * @param Vector $other -- the vector to be added
     * @return vector this+other
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    /**
     * @desc minus a vector
     * @param Vector $other -- the vectors to be subtracted from this
     * @return vector this-other
     */
    minus(other) {
        return this.add(other.negated()); // KSM: notice the usage of negated here, not negate
    }
    /**
     * @desc scale this vector
     * @param float $a -- the scale
     * @return vector a*this
     */
    scale(a) {
        this.x *= a;
        this.y *= a;
        return this;
    }

    /**
     * @desc get the length of the vector
     * @returns {number}
     */
    len() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    /**
     * @desc making the current vector a unit vector
     * @return unit vector
     */
    unit() {
        let len = this.len();
        this.x /= len;
        this.y /= len;
        return this;
    }
}

class Direction extends Vector {
    constructor(x, y) {
        super(x, y);
    }

    /**
     * @desc create a copy of the current direction
     * @returns {Direction}
     */
    copy() {
        return new Direction(this.x, this.y);
    }
    /**
     * @desc operation on copy of the corresponding Direction
     * @return copies of the original Direction, effect corresponding to those without -ed
     */
    negated() {
        return this.copy().negate();
    }
    added(other) {
        return this.copy().add(other);
    }
    minused(other) {
        return this.copy().minus(other);
    }
    scaled(a) {
        return this.copy().scale(a);
    }
    united() {
        return this.copy.unit();
    }
}

class Point extends Vector {
    constructor(x, y) {
        super(x, y);
    }

    /**
     * @desc create a copy of the current direction
     * @returns {Direction}
     */
    copy() {
        return new Direction(this.x, this.y);
    }
    /**
     * @desc operation on copy of the corresponding Direction
     * @return copies of the original Direction, effect corresponding to those without -ed
     */
    negated() {
        return this.copy().negate();
    }
    added(other) {
        return this.copy().add(other);
    }
    minused(other) {
        return this.copy().minus(other);
    }
    scaled(a) {
        return this.copy().scale(a);
    }
    united() {
        return this.copy.unit();
    }
}

//TODO: Upgrade RigidBody to ES6 class representation
class RigidBody {
    constructor(id, mass, x, y, vx, vy, inertia, rotate, omega) {
        this.id = id;
        this.mass = mass;
        this.position = new Point(x, y);
        this.forward = new Direction(vx, vy);
        this.inertia = inertia;
        this.rotation = rotation;
        this.angularVelocity = omega;
    }
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
function rigid(id, mass, x, y, vx, vy, inertia, rotate, omega) {
	this.id = id;
	this.mass = mass;
	this.position = new Vector(x, y);
	this.v = new Vector(vx, vy);
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
    this.set_omega = function(omega) {
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

/**
 * @desc encapsulation of this module
 * KSM: moved to the end since ES6 class does not support hoisting
 */
module.exports = {
    RigidBody: rigid,
    Vector: Vector
};