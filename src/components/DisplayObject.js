import invariant from 'fbjs/lib/invariant'
import { DisplayObject } from 'pixi.js'
import { PROPS_DISPLAY_OBJECT, PROPS_RESERVED } from '../utils/props'
import { isPointType, parsePoint } from '../utils/pixi'
import { not, hasKey } from '../helpers'

Object.defineProperty(DisplayObject, 'reactEventHandlers', {
  get: function() {
    return DisplayObject._reactEventHandlers || []
  },
  set: function(handlers) {
    Object.assign(DisplayObject, {
      _reactEventHandlers: handlers,
      _reactFilterProps: not(hasKey([...Object.keys(PROPS_RESERVED), ...handlers])),
    })
  },
})

DisplayObject.reactEventHandlers = [
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

Object.assign(DisplayObject.prototype, {
  _reactSetValue: function(prop, value) {
    const instance = this
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
  },
  reactApplyProps: function(oldProps, newProps) {
    const instance = this

    invariant(
      DisplayObject.prototype.isPrototypeOf(instance),
      'instance needs to be typeof `PIXI.DisplayObject`, ' + 'got `%s`',
      typeof instance
    )

    // update event handlers
    if (!newProps.ignoreEvents) {
      const hasRemoveListener = typeof instance.removeListener === 'function'
      const hasOn = typeof instance.on === 'function'

      for (let i = 0; i < DisplayObject._reactEventHandlers.length; i++) {
        const evt = DisplayObject._reactEventHandlers[i]
        if (oldProps[evt] !== newProps[evt]) {
          if (typeof oldProps[evt] === 'function' && hasRemoveListener) {
            instance.removeListener(evt, oldProps[evt])
          }
          if (typeof newProps[evt] === 'function' && hasOn) {
            instance.on(evt, newProps[evt])
          }
        }
      }
    }

    const newPropKeys = Object.keys(newProps || {})

    // hard overwrite all props? can speed up performance
    if (newProps.overwriteProps) {
      for (let i = 0; i < newPropKeys.length; i++) {
        const p = newPropKeys[i]
        if (oldProps[p] !== newProps[p]) {
          instance._reactSetValue(p, newProps[p])
        }
      }
      return
    }
    const props = newPropKeys.filter(DisplayObject._reactFilterProps)
    for (let i = 0; i < props.length; i++) {
      const prop = props[i]
      const value = newProps[prop]

      if (value != null) {
        // set value if defined
        instance._reactSetValue(prop, value)
      } else if (instance[prop] != null && prop in PROPS_DISPLAY_OBJECT) {
        // is a default value, use that
        console.warn(`setting default value: ${prop}, from: ${instance[prop]} to: ${value} for`, instance)
        instance._reactSetValue(prop, PROPS_DISPLAY_OBJECT[prop])
      } else {
        console.warn(`ignoring prop: ${prop}, from ${instance[prop]} to ${value} for`, instance)
      }
    }
  },
})

export default DisplayObject
