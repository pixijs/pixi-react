import isNil from 'lodash/isNil'
import invariant from 'fbjs/lib/invariant'
import * as PIXI from 'pixi.js'
import { eventHandlers, setValue } from './pixi'
import { isFunction, not, hasKey } from '../helpers'

export const CHILDREN = 'children'
/**
 * Reserved props
 *
 * @type {Object}
 */
export const PROPS_RESERVED = {
  [CHILDREN]: true,
  parent: true,
  worldAlpha: true,
  worldTransform: true,
  worldVisible: true,
}

/**
 * Default display object props
 * See https://github.com/michalochman/react-pixi-fiber/blob/a4dbddbef0ffbf0f563c64d30766ea28222a51ea/src/props.js#L9
 *
 * @type {Object}
 */
export const PROPS_DISPLAY_OBJECT = {
  alpha: 1,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: 'auto',
  filterArea: null,
  filters: null,
  hitArea: null,
  interactive: false,
  mask: null,
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
  transform: null,
  visible: true,
  x: 0,
  y: 0,
}

/**
 * Helper util for fetching the texture from props
 * Can be either texture or image
 *
 * @param {string} elementType
 * @param {PIXI.Texture} texture
 * @param {string|undefined} image
 * @returns {PIXI.Texture}
 */
export const getTextureFromProps = (elementType, { texture = undefined, image = undefined }) => {
  if (image) {
    invariant(typeof image === 'string', elementType + ' image needs to be a string, got `%s`', typeof image)
    return PIXI.Texture.fromImage(image)
  }

  invariant(texture instanceof PIXI.Texture, elementType + ' texture needs to be typeof `PIXI.Texture`')
  return texture
}

/**
 * Apply default props on Display Object instance (which are all components)
 *
 * @param {PIXI.DisplayObject} instance
 * @param {Object} oldProps
 * @param {Object} newProps
 */
export function applyDefaultProps(instance, oldProps, newProps) {
  invariant(
    PIXI.DisplayObject.prototype.isPrototypeOf(instance),
    'instance needs to be typeof `PIXI.DisplayObject`, ' + 'got `%s`',
    typeof instance
  )

  // update event handlers
  eventHandlers.forEach(function(evt) {
    isFunction(oldProps[evt], instance.removeListener) && instance.removeListener(evt, oldProps[evt])
    isFunction(newProps[evt], instance.on) && instance.on(evt, newProps[evt])
  })

  let props = Object.keys(newProps || {})
    .filter(not(hasKey(PROPS_RESERVED)))
    .filter(not(hasKey(eventHandlers)))

  props.forEach(prop => {
    const value = newProps[prop]

    if (!isNil(value)) {
      // set value if defined
      setValue(instance, prop, value)
    } else if (!isNil(instance[prop]) && !isNil(PROPS_DISPLAY_OBJECT[prop])) {
      // is a default value, use that
      console.warn(`setting default value: ${prop}, from: ${instance[prop]} to: ${value} for`, instance)
      setValue(instance, prop, PROPS_DISPLAY_OBJECT[prop])
    } else {
      console.warn(`ignoring prop: ${prop}, from ${instance[prop]} to ${value} for`, instance)
    }
  })
}
