var vec3 = {
    create: require('gl-vec3/create'),
    add: require('gl-vec3/add'),
    multiply: require('gl-vec3/multiply'),
    sub: require('gl-vec3/subtract'),
    scale: require('gl-vec3/scale'),
    copy: require('gl-vec3/copy'),
    sqrLen: require('gl-vec3/squaredLength'),
    fromValues: require('gl-vec3/fromValues'),
}
module.exports = require('./lib/build')(vec3)