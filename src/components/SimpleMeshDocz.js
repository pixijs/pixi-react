import * as PIXI from 'pixi.js'
/* eslint-disable */

const w = 500
const h = 300

export const indices = new Uint16Array([0, 3, 4, 0, 1, 4, 1, 2, 4, 2, 4, 5, 3, 4, 6, 4, 6, 7, 4, 7, 8, 4, 5, 8])

export const uvs = new Float32Array([0, 0, 0.5, 0, 1, 0, 0, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 0.5, 1, 1, 1])

export const vertices = new Float32Array([0, 0, w / 2, 0, w, 0, 0, h / 2, w / 2, h / 2, w, h / 2, 0, h, w / 2, h, w, h])

let DRAW_MODES = 1

if (typeof window !== 'undefined') {
  DRAW_MODES = PIXI.DRAW_MODES
}

export { DRAW_MODES }
