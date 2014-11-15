
require('canvas-testbed')(render, start)

var World = require('../')
var vec = require('gl-matrix').vec2
var array = require('array-range')
var random = require('randf')

//a mouse vector
var mouse = require('touch-position')({ position: [-10000, -10000] })

var system,
    vertices


function render(ctx, width, height, dt) {
    system.max = [null, height]
    system.integrate(vertices, dt/1000)

    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, width, height)

    ctx.beginPath()
    vertices.forEach(function(v) {
        var p = v.position
        ctx.moveTo(p[0], p[1])
        ctx.arc(p[0], p[1], 2, Math.PI*2, 0, false)
    })
    ctx.fillStyle = '#fff'
    ctx.fill()
}

function start(ctx, width, height) {
    system = World({
        gravity: [0, 400, 0]
    })

    vertices = array(25).map(function() {
        return system.vertex({
            position: [ random(0, width), random(0, height) ]
        })
    })
}