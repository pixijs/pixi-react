import invariant from 'fbjs/lib/invariant'
import * as PIXI from 'pixi.js'
import { RESERVED_PROPS } from './props'

/* Helper Methods */

export const not = fn => (...args) => !fn(...args)

export const including = props => key => props.indexOf(key) !== -1

export function filterByKey(inputObject, filter) {
  const exportObject = {}

  Object.keys(inputObject)
    .filter(filter)
    .forEach(key => {
      exportObject[key] = inputObject[key]
    })

  return exportObject
}

/* Concrete Helper Methods */

export const includingReservedProps = including(Object.keys(RESERVED_PROPS))

/* PIXI related Methods */

// Converts value to an array of coordinates
export function parsePoint(value) {
  let arr = []
  if (typeof value === 'undefined') {
    return arr
  } else if (typeof value === 'string') {
    arr = value.split(',')
  } else if (typeof value === 'number') {
    arr = [value]
  } else if (Array.isArray(value)) {
    // shallow copy the array
    arr = value.slice()
  } else if (typeof value.x !== 'undefined' && typeof value.y !== 'undefined') {
    arr = [value.x, value.y]
  }

  return arr.map(Number)
}

export function isPointType(value) {
  return value instanceof PIXI.Point || value instanceof PIXI.ObservablePoint
}

// Set props on a DisplayObject by checking the type. If a PIXI.Point or
// a PIXI.ObservablePoint is having its value set, then either a comma-separated
// string with in the form of "x,y" or a size 2 array with index 0 being the x
// coordinate and index 1 being the y coordinate.
// See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L114
export function setPixiValue(instance, propName, value) {
  if (isPointType(instance[propName]) && isPointType(value)) {
    // Just copy the data if a Point type is being assigned to a Point type
    instance[propName].copy(value)
  } else if (isPointType(instance[propName])) {
    // Parse value if a non-Point type is being assigned to a Point type
    const coordinateData = parsePoint(value)

    invariant(
      typeof coordinateData !== 'undefined' && coordinateData.length > 0 && coordinateData.length < 3,
      'The property `%s` is a PIXI.Point or PIXI.ObservablePoint and must be set to a comma-separated string of ' +
        'either 1 or 2 coordinates, a 1 or 2 element array containing coordinates, or a PIXI Point/ObservablePoint. ' +
        'If only one coordinate is given then X and Y will be set to the provided value. Received: `%s` of type `%s`.',
      propName,
      JSON.stringify(value),
      typeof value
    )

    instance[propName].set(coordinateData.shift(), coordinateData.shift())
  } else {
    // Just assign the value directly if a non-Point type is being assigned to a non-Point type
    instance[propName] = value
  }
}

export const isProd = process.env.NODE_ENV === 'production'
