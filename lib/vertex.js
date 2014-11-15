module.exports = function(vec) {
    function Vertex(opt) {
        this.position = vec.create()
        this.previous = vec.create()
        this.acceleration = vec.create()
        this.mass = 1.0

        if (opt && opt.position) {
            vec.copy(this.position, opt.position)
        }
        if (opt && (opt.previous||opt.position)) {
            vec.copy(this.previous, opt.previous || opt.position)
        }
        if (opt && opt.acceleration)
            vec.copy(this.acceleration, opt.acceleration)
    }

    Vertex.prototype.addForce = function(v) {
        vec.sub(this.previous, this.previous, v)
    }

    Vertex.prototype.place = function(v) {
        vec.copy(this.position, v)
        vec.copy(this.previous, v)
    }

    return Vertex
}