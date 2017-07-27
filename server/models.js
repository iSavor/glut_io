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

class RigidBody {
    constructor(id, mass, x, y, v, angle, radius) {
        this.id = id;
        this.mass = mass;
        this.v = v;
        this.position = new Point(x, y);
        this.angle = angle;
        this.radius = radius;
        this.stopping = false;
        this.distance = 0;
    }

    set_angle(angle) {
        this.angle = angle;
    }

    accelerate() {
        if (this.v < 5) {
            this.v += 0.1;
        }
    }

    move() {
        if (this.stopping)
            return;
        this.position.x += Math.cos(this.angle)*this.v;
        this.position.y += Math.sin(this.angle)*this.v;
        var touched = false;
        //TODO: 2900 should be replaced
        if (this.position.x <= 0) {
            this.position.x = 0;
            touched = true;
        } else if (this.position.x >= 2900) {
            this.position.x = 2900;
            touched = true;
        }
        if (this.position.y <= 0) {
            this.position.y = 0;
            touched = true;
        } else if (this.position.y >= 2900) {
            this.position.y = 2900;
            touched = true;
        }
        return touched;
    }

    unmove() {
        this.position.x -= Math.cos(this.angle)*this.v;
        this.position.y -= Math.sin(this.angle)*this.v;
        //TODO: 2900 should be replaced
        if (this.position.x <= 0) {
            this.position.x = 0;
        } else if (this.position.x >= 3000 - this.radius) {
            this.position.x = 3000 - this.radius;
        }
        if (this.position.y <= 0) {
            this.position.y = 0;
        } else if (this.position.y >= 3000 - this.radius) {
            this.position.y = 3000 - this.radius;
        }
    }
}


class Player {
    constructor(id, socket, body) {
        this.id = id;
        this.socket = socket;
        this.body = body;
    }
}

/**
 * @desc encapsulation of this module
 * KSM: moved to the end since ES6 class does not support hoisting
 */
module.exports = {
    RigidBody: RigidBody,
    Vector: Vector,
    Player: Player
};