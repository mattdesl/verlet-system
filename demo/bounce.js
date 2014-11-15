require('canvas-testbed')(render, start)

var Point = require('verlet-point')
var World = require('../')

var world,
    point,
    radius = 25

function render(ctx, width, height, dt) {
    ctx.clearRect(0, 0, width, height)

    world.max = [width, height]
    world.min = [0, 0]
    world.integratePoint(point, dt/1000)

    ctx.beginPath()
    ctx.arc(point.position[0], point.position[1], radius, 0, Math.PI*2, false)
    ctx.fill()
}

function start(ctx, width, height) {
    world = World({ 
        gravity: [500, 500],
        // bounce: 0.5 //collision friction
    })
    
    point = Point({ 
        position: [width/2, height/2], 
        radius: radius 
    })
}