module.exports = function(vec) {
    var negInfinity = vec.fromValues(-Infinity, -Infinity, -Infinity)
    var posInfinity = vec.fromValues(Infinity, Infinity, Infinity)
    var ones = vec.fromValues(1, 1, 1)
    var reflect = vec.create()
    var EPSILON = 0.000001
    var EDGE = 1

    return function collider(p, velocity, min, max, friction) {
        if (!min && !max)
            return
            
        //reset reflection 
        vec.copy(reflect, ones)

        min = min || negInfinity
        max = max || posInfinity

        var i = 0,
            n = p.position.length,
            hit = false


        //TODO: handle edge fix
        //bounce and clamp
        for (i=0; i<n; i++)
            if (typeof min[i] === 'number' && p.position[i] < min[i]) {
                reflect[i] = velocity[i] > 0 ? -1 : 1
                p.position[i] = min[i]
                hit = true
            }
        for (i=0; i<n; i++)
            if (typeof max[i] === 'number' && p.position[i] > max[i]) {
                reflect[i] = velocity[i] > 0 ? -1 : 1
                p.position[i] = max[i]
                hit = true
            }

        //no bounce
        var len2 = vec.sqrLen(velocity)
        if (!hit || len2 <= EPSILON)
            return

        var m = Math.sqrt(len2)
        if (m !== 0) 
            vec.scale(velocity, velocity, 1/m)

        //scale bounce by friction
        vec.scale(reflect, reflect, m * friction)

        //bounce back
        vec.multiply(velocity, velocity, reflect)
    }
}