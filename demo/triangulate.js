
require('canvas-testbed')(render, start)


var vec = require('gl-vec2')
var array = require('array-range')

var smoothstep = require('smoothstep')
var delaunay = require('delaunay-triangulate')
var drawTriangles = require('./draw-triangles')
var xtend = require('xtend')
var random = require('randf')

var World = require('../')
var Point = require('verlet-point')

//a mouse vector
var mouse = require('touch-position')({ position: [-10000, -10000] })

//for mobile, prevent page swiping
require('add-event-listener')(window, 'touchstart', function (ev) {
    ev.preventDefault()
})

var system,
    particles,
    positions,
    cells,
    dir = vec.create()

var MAX_PARTICLES = 50

function render(ctx, width, height, dt) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, width, height)
        
    update(width, height, dt)
    draw(ctx)
}

function start(ctx, width, height) {
    system = World()

    particles = array(MAX_PARTICLES).map(function(i) {
        var angle = i/(MAX_PARTICLES-1) * Math.PI * 20
        var scale = 100

        var rot = [
            Math.cos(angle) * scale,
            Math.sin(angle) * scale
        ]

        var force = vec.scale([], rot, -angle*0.001)

        return Point({
            position: vec.add([], rot, [width/2, height/2])
        }).addForce(force)
    })
}

function update(width, height, dt) {
    //do some mouse motion
    particles.forEach(function(p) {
        var s = 0.05

        //get direction of mouse to this particle
        vec.sub(dir, mouse, p.position)
        vec.normalize(dir, dir)

        //perform some mouse motion on the vertices
        var dist = smoothstep(100, 50, vec.distance(p.position, mouse))
        vec.scale(dir, dir, dist*0.5)
        p.addForce(dir)
    })

    //constrain world
    system.max = [width, height]
    system.min = [0, 0]
    
    //step the physics
    system.integrate(particles, dt/1000)

    //perform triangulation on all points
    positions = particles.map(function(p) {
        return p.position
    })
    cells = delaunay(positions)
}

function draw(ctx) {
    ctx.beginPath()
    particles.forEach(function(p) {
        ctx.moveTo(p.position[0], p.position[1])
        ctx.arc(p.position[0], p.position[1], 2, Math.PI*2, 0, false)
    })
    ctx.fillStyle = '#3be543'
    ctx.globalAlpha = 1.0
    ctx.fill()

    ctx.beginPath()
    drawTriangles(ctx, positions, cells)
    ctx.strokeStyle = '#fff'
    ctx.globalAlpha = 0.25
    ctx.stroke()
}
