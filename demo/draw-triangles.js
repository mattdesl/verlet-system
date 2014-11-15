var vec2 = require('gl-matrix').vec2

module.exports = function drawTriangles(ctx, positions, cells, start, end) {
    var v = positions
    start = (start|0)
    end = typeof end === 'number' ? (end|0) : cells.length

    for (; start < end && start < cells.length; start++) {
        var f = cells[start]

        var v0 = v[f[0]],
            v1 = v[f[1]],
            v2 = v[f[2]]

        ctx.moveTo(v0[0], v0[1])
        ctx.lineTo(v1[0], v1[1])
        ctx.lineTo(v2[0], v2[1])
        ctx.lineTo(v0[0], v0[1])
    }
}