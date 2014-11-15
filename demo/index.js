
require('canvas-testbed')(render, start)

var World = require('../')
var vec = require('gl-matrix').vec2
var array = require('array-range')
var smoothstep = require('smoothstep')
var delaunay = require('delaunay-triangulate')
var drawTriangles = require('./draw-triangles')
var xtend = require('xtend')
var lerp = require('lerp-array')
var random = require('randf')

//a mouse vector
var mouse = require('touch-position')({ position: [-10000, -10000] })

var systems,
    dir = vec.create()

var MAX_PARTICLES = 50,
    MAX_SYSTEMS = 3,
    min = [0.25, 0.25],
    max = [0.75, 0.75]

function render(ctx, width, height, dt) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, width, height)
        
    systems.forEach(function(s) {
        update(s, width, height, dt)
        draw(s, ctx)
    })
}

function start(ctx, width, height) {
    var colors = ['#3269a1', '#c32929', '#7ff5b6']
    var speeds = [0.2, 0.21, 0.22]
    var counts = [25, 20, 15]
    var explodes = [0.25, 0.10, 0.40]

    systems = array(MAX_SYSTEMS).map(function(e, i, self) {
        var a = (i+1)/self.length
        return create(width, height, {
            alpha: a,
            count: counts[i%counts.length],
            speed: speeds[i%speeds.length],
            color: colors[i%colors.length],
            explode: explodes[i%explodes.length]
        })
    })
}

function update(system, width, height, dt) {
    //do some mouse motion
    system.particles.forEach(function(p) {
        var s = 0.05

        vec.sub(dir, mouse, p.position)
        vec.normalize(dir, dir)

        //perform some mouse motion on the vertices
        var dist = smoothstep(100, 50, vec.distance(p.position, mouse))
        vec.scale(dir, dir, dist*system.speed*0.5)
        p.addForce(dir)
    })

    //constrain world - clamps & bounces vertices
    system.world.max = [width, height]
    system.world.min = [0, 0]
    
    system.world.integrate(system.particles, dt/1000)

    system.positions = system.particles.map(function(p) {
        return p.position
    })
    system.cells = delaunay(system.positions)
}

function draw(system, ctx) {
    var particles = system.particles

    ctx.beginPath()
    particles.forEach(function(p) {
        ctx.moveTo(p.position[0], p.position[1])
        ctx.arc(p.position[0], p.position[1], 1, Math.PI*2, 0, false)
    })
    ctx.fillStyle = system.color 
    ctx.globalAlpha = system.alpha 
    ctx.fill()

    ctx.beginPath()
    drawTriangles(ctx, system.positions, system.cells)
    ctx.strokeStyle = '#fff'
    ctx.globalAlpha = system.alpha * 0.15
    ctx.stroke()
}

function create(width, height, opt) {
    opt = opt||{}

    var world = World({ 
        gravity: [0, 0, 0]
    })

    var particles = array(opt.count || MAX_PARTICLES).map(function(e, i, self) {
        var scale = 45
        var a = i/(self.length-1)
        var angle = a * Math.PI * 8

        var rot = [ 
            Math.cos(angle) * scale,
            Math.sin(angle) * scale
        ]

        var vert = world.vertex({
            position: vec.add([], rot, [width/2, height/2])
        })

        var explode = Math.sin(i/300) * 0.7

        //bit of initial movement
        vert.addForce(vec.scale(rot, rot, explode))
        return vert
    })

    return xtend({
        world: world,
        speed: 0.5,
        particles: particles,
    }, opt)
}