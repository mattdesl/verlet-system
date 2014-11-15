# verlet-system

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/zBwknK0.png)

A tiny 2D/3D verlet physics system.

```js
var Point = require('verlet-point')
var array = require('array-range')
var random = require('randf')

var world = require('verlet-system')({ 
    gravity: [0, 500],
    max: [width, height]
})

//create 500 points
var points = array(500).map(function() {
    return Point({ 
        position: [ random(0, width), random(0, height) ]
    })
})

//draw our scene
fuction render() {
    //step the physics
    world.integrate(points, dt)

    drawPoints(points)
}
```

Also works on bare objects with the following structure:

```
var point = {
    position: [x, y],
    previous: [x, y],
    acceleration: [x, y],
    mass: 1     //optional, will default to 1.0
    radius: 25  //optional, will default to 0.0
}
```

Points with a mass of 0 are considered "unmovable". Radius is only used for collision testing against `min` and `max`, but different applications may choose to ignore this. 

By default, assumes 2D and points with `[x, y]`. You can require an explicit dimension like so: 

```js
var World2D = require('verlet-system/2d') //points [x, y]
var World3D = require('verlet-system/3d') //points [x, y, z]
```

PRs for robustness/fixes are welcome.

## bounded collisions

Collisions are ignored unless you set a `min` and/or `max` vector on the system (with the same number of components as the rest of your points). This will lead to particles 'bouncing' off the collision box. If a component is not a number, it will be ignored (i.e. act as infinity). For example, to allow particles to flow freely horizontally, but restrict them to the 2D window vertically, you might do this:

```js
world.min = [null, 0]
world.max = [null, height]
```

You can also specify a `radius` on points which will get used in the collision testing. See [demo/bounce.js](demo/bounce.js). By default, `min` and `max` are null objects, and no collisions are computed. 

## Usage

[![NPM](https://nodei.co/npm/verlet-system.png)](https://nodei.co/npm/verlet-system/)

#### `system = require('verlet-system')([opt])`

Creates a new system with the specified options.

- `gravity` a vector describing the gravity of this system, defaults to a zero vector
- `min` the minimum bounds vector, defaults to null (i.e. negative infinity)
- `max` the maximum bounds vector, defaults to null (i.e. positive infinity)
- `friction` the air friction, defaults to 0.98
- `bounce` the friction with collision edges i.e. "bounciness"

#### `system.integrate(points, step)`

Integrates the list of "points" with the given step (typically in seconds). 

#### `system.integratePoint(point, step)`

Integrates a single "point".

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/verlet-system/blob/master/LICENSE.md) for details.
