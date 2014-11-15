var vec2 = {
    create: require('gl-vec2/create'),
    add: require('gl-vec2/add'),
    multiply: require('gl-vec2/multiply'),
    sub: require('gl-vec2/subtract'),
    scale: require('gl-vec2/scale'),
    copy: require('gl-vec2/copy'),
    sqrLen: require('gl-vec2/squaredLength'),
    fromValues: require('gl-vec2/fromValues'),
}
module.exports = require('./lib/build')(vec2)