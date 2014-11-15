
require('canvas-testbed')(render, start)

var World = require('../')
var vec = require('gl-matrix').vec2
var array = require('array-range')
var random = require('randf')

var Constraint = require('../lib/constraint')(vec)

var system,
    vertices,
    constraints,
    drawRects = true

function render(ctx, width, height, dt) {
    ctx.clearRect(0, 0, width, height)

    //constrain the system within the window bounds
    system.min = [0, 0]
    system.max = [width, height]

    //integrate the physics
    system.integrate(vertices, dt/1000)

    //perform constraint solving
    constraints.forEach(function(c) {
        return c.solve()
    })

    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, width, height)

    ctx.beginPath()
    vertices.forEach(function(v, i) {
        if (!v.rect)
            return

        var p = v.position
        ctx.moveTo(p[0], p[1])
        var s = 2
        ctx.rect(p[0]-s/2, p[1]-s/2, s, s)
        // ctx.arc(p[0], p[1], 2, Math.PI*2, 0, false)
    })
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    constraints.forEach(function(c) {
        ctx.beginPath()
        c.points.forEach(function(p) {
            ctx.lineTo(p.position[0], p.position[1])    
        })
        ctx.stroke()
    })
}

function start(ctx, width, height) {
    //create a world with no gravity
    system = World()


    //create N particles with some initial momentum
    vertices = array(400).map(function(e, i, self) {
        var scale = random(10, 15)
        var a = i/(self.length-1)
        var angle = a * Math.PI * 4

        var rot = [ 
            Math.cos(angle) * scale,
            Math.sin(angle) * scale
        ]

        //create a new vertex near the middle
        var vert = system.vertex({
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

    constraints = []
    for (var i=0; i<vertices.length; i+=2) {
        constraints.push([ vertices[i], vertices[(i+1)%vertices.length] ])
    }
    constraints = constraints.map(function(points) {
        return Constraint(points, { restingDistance: 10, stiffness: 0.05 })
    })

    //apply our "rotation" explode
    setTimeout(function() {
        rotate(vertices, 1)
    }, 1500)

    //then apply our gravity fall    
    setTimeout(function() {
        system.gravity[1] = 500
    }, 2500)

}

function rotate(vertices, stagger) {
    var delay = 0
    //this adds a new timer for each vertex,
    //staggering the delay slightly
    //the effect will add a rotational force and disable rectangle drawing
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