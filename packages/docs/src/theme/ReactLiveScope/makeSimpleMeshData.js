/* eslint-disable */

export default function makeSimpleMeshData() {
    const w = 500
    const h = 300

    const indices = new Uint16Array([
        0,3,4,
        0,1,4,
        1,2,4,
        2,4,5,
        3,4,6,
        4,6,7,
        4,7,8,
        4,5,8,
    ])

    const uvs = new Float32Array([
        0, 0,          0.5, 0,          1, 0,
        0, 0.5,        0.5, 0.5,        1, 0.5,
        0, 1,          0.5, 1,          1, 1,
    ])

    const vertices = new Float32Array([
        0,0,       w/2, 0,       w, 0,
        0,h/2,     w/2, h/2,     w, h/2,
        0,h,       w/2, h,       w, h,
    ])

    return {
        indices,
        uvs,
        vertices,
    }
}
