import { Point, ObservablePoint } from 'pixi.js'
import invariant from 'fbjs/lib/invariant'
import idx from 'idx'
import isNil from 'lodash.isnil'

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

/**
 * Event handlers
 *
 * @type {string[]}
 */
export const eventHandlers = [
  'click',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'mouseupoutside',
  'tap',
  'touchstart',
  'touchmove',
  'touchend',
  'touchendoutside',
  'pointercancel',
  'pointerout',
  'pointerover',
  'pointertap',
  'pointerdown',
  'pointerup',
  'pointerupoutside',
  'pointermove',
  'rightclick',
  'rightdown',
  'rightup',
  'rightupoutside',
  'touchcancel',
  'touchendoutside',
  'touchmove',
  'touchstart',
]

/**
 * Set value on a PIXI.DisplayObject
 * See https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L114
 *
 * @param {PIXI.DisplayObject} instance
 * @param {string} prop
 * @param {*} value
 */
export function setValue(instance, prop, value) {
  if (isPointType(instance[prop]) && isPointType(value)) {
    // copy value
    instance[prop].copyFrom(value)
  } else if (isPointType(instance[prop])) {
    // parse value if a non-Point type is being assigned to a Point type
    const coordinates = parsePoint(value)

    invariant(
      typeof coordinates !== 'undefined' && coordinates.length > 0 && coordinates.length < 3,
      'The property `%s` is a `PIXI.Point` or `PIXI.ObservablePoint` and must be set to a comma-separated string of ' +
        'either 1 or 2 coordinates, a 1 or 2 element array containing coordinates, or a PIXI Point/ObservablePoint. ' +
        'If only one coordinate is given then X and Y will be set to the provided value. Received: `%s` of type `%s`.',
      prop,
      JSON.stringify(value),
      typeof value
    )

    instance[prop].set(coordinates.shift(), coordinates.shift())
  } else {
    // just hard assign value
    instance[prop] = value
  }
}
