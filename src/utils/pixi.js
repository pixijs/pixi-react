import { Point, ObservablePoint } from 'pixi.js'
import invariant from 'fbjs/lib/invariant'
import idx from 'idx'

/**
 * Parse PIXI point value to array of coordinates
 *
 * @param {*} value
 * @returns {Array}
 */
export function parsePoint(value) {
  let arr = []

  if (typeof value === 'undefined') {
    return arr
  } else if (typeof value === 'string') {
    arr = value.split(',')
  } else if (typeof value === 'number') {
    arr = [value]
  } else if (Array.isArray(value)) {
    arr = [...value]
  } else if (value !== null && typeof value === 'object') {
    const x = idx(value, _ => _.x) || 0
    const y = idx(value, _ => _.y) || 0
    arr = [x, y]
  } else {
    return arr
  }

  return arr.filter(p => p != null && !isNaN(p)).map(Number)
}

/**
 * Determine value is type of Point or ObservablePoint
 * See https://github.com/michalochman/react-pixi-fiber/blob/a4dbddbef0ffbf0f563c64d30766ea28222a51ea/src/utils.js#L48
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isPointType(value) {
  return value instanceof Point || value instanceof ObservablePoint
}
