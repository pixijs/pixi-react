import * as PIXI from 'pixi.js'
import idx from 'idx'
import isNil from 'lodash/isNil'

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

  return arr.filter(p => !isNil(p) && !isNaN(p)).map(Number)
}
