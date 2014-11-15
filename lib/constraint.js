// verlet-constraint

var number = require('as-number')

module.exports = function(vec) {
    var delta = vec.create()
    var scaled = vec.create()

    function Constraint(points, opt) {
        if (!points || points.length !== 2)
            throw new Error('two points must be specified for the constraint')
        this.points = points
        this.stiffness = number(opt && opt.stiffness, 1.0)
        if (opt && typeof opt.restingDistance)
            this.restingDistance = opt.restingDistance
        else
            this.restingDistance = vec.distance(this.points[0].position, this.points[1].position)
        // this.tearDistance = number(opt && opt.tearDistance)
    }

    Constraint.prototype.solve = function() {
        //distance formula
        var p1 = this.points[0],
            p2 = this.points[1],
            p1vec = p1.position,
            p2vec = p2.position

        vec.sub(delta, p1vec, p2vec)
        var d = Math.sqrt(vec.dot(delta, delta))

        //tear the constraint 
        // if (this.tearDistance && d > this.tearDistance) {
        //     this.p1.removeConstraint(this)
        // }
        
        //ratio for resting distance
        var restingRatio = d===0 ? this.restingDistance : (this.restingDistance - d) / d
        
        //invert mass quantities
        var im1 = 1.0 / (p1.mass||0)
        var im2 = 1.0 / (p2.mass||0)
        var scalarP1 = (im1 / (im1 + im2)) * this.stiffness
        var scalarP2 = this.stiffness - scalarP1
        
        //push/pull based on mass
        vec.scale(scaled, delta, scalarP1 * restingRatio)
        vec.add(p1vec, p1vec, scaled)
        
        vec.scale(scaled, delta, scalarP2 * restingRatio)
        vec.sub(p2vec, p2vec, scaled)
    }

    return function(p1, p2, opt) {
        return new Constraint(p1, p2, opt)
    }
}