# verlet-system

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/ZzGLmJE.png)

A tiny 2D/3D verlet physics system.

```js
var Point = require('verlet-point')
var array = require('array-range')
var random = require('randf')

//create a world where points stay within window bounds
var world = require('verlet-system')({ 
    gravity: [0, 500],
    min: [0, 0],
    max: [width, height]
})

//create 500 points scattered around page
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

Typically used alongside [verlet-constraint](https://www.npmjs.org/package/verlet-constraint) and [verlet-point](https://www.npmjs.org/package/verlet-point).

By default, assumes 2D and points with `[x, y]`. You can require an explicit dimension like so: 

```js
var World2D = require('verlet-system/2d') //points [x, y]
var World3D = require('verlet-system/3d') //points [x, y, z]
```

PRs for fixes/improvements welcome.

### demos

See the [demos](demo/) folder. The demos are [run](#running-demos) with beefy.

- [triangulate](http://mattdesl.github.io/verlet-system/demo/triangulate.html) - mouse interactions
- [line](http://mattdesl.github.io/verlet-system/demo/line.html) - using constraints

### points

You can use [verlet-point](https://www.npmjs.org/package/verlet-point), or just bare objects with the following structure:

```
var point = {
    position: [x, y],     //required
    previous: [x, y],     //required
    acceleration: [x, y], //required
    mass: 1               //optional, will default to 1.0
    radius: 25            //optional, will default to 0.0
}
```

Points with a mass of 0 are considered "unmovable". `radius` is used for collision testing against `min` and `max`, but different applications may choose to ignore this. 

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
- `bounce` the friction with collision edges, i.e. "bounciness", defaults to 1.0

#### `system.integrate(points, step)`

Integrates the list of "points" with the given step (typically in seconds). 

#### `system.integratePoint(point, step)`

Integrates a single "point".

## running demos

```sh
git clone https://github.com/mattdesl/verlet-system.git
cd verlet-system
npm install

# if you haven't got these tools,
# install them globally
npm install browserify beefy uglify-js -g

# now run or build any of the demos
npm run line 
npm run triangulate

npm run build-line
npm run build-triangulate
```

Should work with any tool that consumes CommonJS (i.e. jspm, DuoJS, browserify, webpack).

## comparisons

This is not meant to be as feature-complete as choices like [verlet-js](https://github.com/subprotocol/verlet-js), [PhysicsJS](https://github.com/wellcaffeinated/PhysicsJS), or [matter-js](http://brm.io/matter-js/). Some novel goals of this project:

- works in 2D or 3D
- no assumptions about rendering (i.e. works in WebGL, SVG, etc)
- no assumptions about interactions or geometries
- tiny and modular (3kb-6kb depending on what you require), e.g. you may not need constraints (as in the `triangulate` demo)
- works on bare objects and arrays, easy to build your own systems on top of
- uses a bounding box rather than just a Y value for "floor"

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/verlet-system/blob/master/LICENSE.md) for details.
