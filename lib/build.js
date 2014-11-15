var number = require('as-number')
var clamp = require('clamp')
var createCollider = require('./box-collision')
var createVertex = require('./vertex')

var noop = function noop() {}

module.exports = function create(vec) {
    
    var collide = createCollider(vec)

    var velocity = vec.create()
    var tmp = vec.create()
    var zero = vec.create()

    var Vertex = createVertex(vec)

    function System(opt) {
        if (!(this instanceof System))
            return new System(opt)

        opt = opt||{}

        this.gravity = opt.gravity || vec.create()
        this.friction = number(opt.friction, 0.98)
        this.min = opt.min
        this.max = opt.max
        this.bounce = number(opt.bounce, 1)
    }
        
    System.prototype.vertex = function(opt) {
    //todo: replace in favour of constraint pattern
        return new Vertex(opt)
    }

    System.prototype.collision = function(p, velocity) {
        collide(p, velocity, this.min, this.max, this.bounce)
    }

    System.prototype.integrate = function(verticies, delta) {
        var friction = this.friction   

        for (var i=0; i<verticies.length; i++) {
        //todo: make this a standalone function
            var p = verticies[i]

            vec.add(p.acceleration, p.acceleration, this.gravity)
            if (p.mass) 
                vec.scale(p.acceleration, p.acceleration, p.mass)
                
            //difference in positions
            vec.sub(velocity, p.position, p.previous)

            //dampen velocity
            vec.scale(velocity, velocity, friction)

            //handle custom collisions in 2D or 3D space
            this.collision(p, velocity)

            //set last position
            vec.copy(p.previous, p.position)
            var tSqr = delta * delta
                
            //integrate
            vec.scale(tmp, p.acceleration, 0.5 * tSqr)
            vec.add(p.position, p.position, velocity)
            vec.add(p.position, p.position, tmp)

            //reset acceleration
            vec.copy(p.acceleration, zero)
        }
    }

    return System
}