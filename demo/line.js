require('canvas-testbed')(render, start)

var World = require('../')
var vec = {
    scale: require('gl-vec2/scale'),
    add: require('gl-vec2/add')
}
var array = require('array-range')
var random = require('randf')

var Constraint = require('verlet-constraint')
var Point = require('verlet-point')

var system,
    vertices,
    constraints

function render(ctx, width, height, dt) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, width, height)
    
    tick(width, height, dt)

    //draw rectangles at verlet points
    ctx.beginPath()
    vertices.forEach(function(v, i) {
        if (!v.rect)
            return

        var p = v.position
        ctx.moveTo(p[0], p[1])
        var s = 2
        ctx.rect(p[0]-s/2, p[1]-s/2, s, s)
    })
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fill()

    //draw lines for our constraints
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    constraints.forEach(function(c) {
        ctx.beginPath()
        c.points.forEach(function(p) {
            ctx.lineTo(p.position[0], p.position[1])    
        })
        ctx.stroke()
    })
}

function tick(width, height, dt) {
    //constrain the system within the window bounds
    system.min = [0, 0]
    system.max = [width, height]

    //integrate the physics
    system.integrate(vertices, dt/1000)

    //perform constraint solving
    constraints.forEach(function(c) {
        return c.solve()
    })
}

function start(ctx, width, height) {
    //create a world with no gravity
    system = World()

    //create N particles with some initial momentum
    vertices = createVertices(500, width, height)

    //create some constraints that "tie" the points together
    constraints = createConstraints(vertices)

    //apply our "rotation" explode
    setTimeout(function() {
        rotate(vertices, 1)
    }, 1500)

    //then apply our gravity to make the points fall
    setTimeout(function() {
        system.gravity[1] = 500
    }, 2500)
}

function createVertices(n, width, height) {
    return array(n).map(function(e, i, self) {
        var scale = random(10, 15)
        var a = i/(self.length-1)
        var angle = a * Math.PI * 4

        var rot = [ 
            Math.cos(angle) * scale,
            Math.sin(angle) * scale
        ]

        //create a new vertex near the middle
        var vert = Point({
            position: vec.add([], rot, [width/2, height/2])
        })

        //add a force for when the particles first appear
        vert.addForce(vec.scale([], rot, 0.2 * a))
        
        //make one head heavier than the other
        if (i%2===0)
            vert.mass = 2

        //custom flag for whether to draw a rect
        vert.rect = true

        return vert
    })
}

function createConstraints(vertices) {
    //make our connections
    var points = []
    for (var i=0; i<vertices.length; i+=2) {
        points.push([ vertices[i], vertices[(i+1)%vertices.length] ])
    }

    //turn each into a constraint
    return points.map(function(p) {
        return Constraint(p, { restingDistance: 10, stiffness: 0.05 })
    })
}

function rotate(vertices, stagger) {
    var delay = 0
    //this adds a new timer for each vertex,
    //staggering the delay slightly
    //the effect will add a rotational force, hiding rectangles as it goes
    vertices.forEach(function(v, i, self) {
        setTimeout(function() {
            var scale = 50

            //add in some more rotation for good measure
            var a = i/(self.length-1)
            var angle = a * Math.PI * 40 + random(20,30)
            var rot = [ Math.cos(angle) * scale, Math.sin(angle) * scale ]
            v.addForce(vec.scale(rot, rot, -0.5 * a))
            v.rect = false
        }, delay)
        delay += stagger||0
    })
}