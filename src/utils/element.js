import invariant from 'fbjs/lib/invariant'
import idx from 'idx'
import { applyDefaultProps } from './props'
import cssManager from '../cssManager/cssManager'
import * as components from '../components'

/**
 * Available tag types
 *
 * @type {Object}
 */
export const TYPES = {
  BitmapText: 'BitmapText',
  Container: 'Container',
  Graphics: 'Graphics',
  NineSlicePlane: 'NineSlicePlane',
  ParticleContainer: 'ParticleContainer',
  Sprite: 'Sprite',
  AnimatedSprite: 'AnimatedSprite',
  Text: 'Text',
  TilingSprite: 'TilingSprite',
  SimpleMesh: 'SimpleMesh',
  SimpleRope: 'SimpleRope',
}

const ELEMENTS = Object.keys(TYPES).reduce((elements, type) => ({ ...elements, [type]: components[type] }), {})

/**
 * Inject types
 *
 * @type {Object}
 */
export const TYPES_INJECTED = {}

/**
 * Create an element based on tag type
 * Similar to react-dom's `React.createElement()`
 *
 * @param {string} type Element type
 * @param {Object} props Component props
 * @param {Object} root Root instance
 * @returns {PIXI.*|undefined}
 */
export function createElement(type, { className, ...props } = {}, root = null) {
  const fn = ELEMENTS[type]
  let instance
  let applyProps
  let cssProps
  let cssMan
  if (typeof fn === 'function') {
    instance = fn(root, props)
  }

  if (!instance) {
    // not found, is there any injected custom component?
    const injected = TYPES_INJECTED[type]
    if (injected) {
      instance = injected.create(props)
      instance.didMount = injected.didMount ? injected.didMount.bind(instance) : undefined
      instance.willUnmount = injected.willUnmount ? injected.willUnmount.bind(instance) : undefined
      instance.applyProps = injected.applyProps ? injected.applyProps.bind(instance) : undefined
    }
  }

  // apply initial props!
  if (instance) {
    if (className) {
      cssMan = cssManager(instance, type, applyDefaultProps)
      instance.cssManager = cssMan
      cssMan.setProps(props)
      cssProps = cssMan.setCSSProps(className, null, props)
    }
    applyProps = idx(instance, _ => _.applyProps)
    if (typeof applyProps !== 'function') {
      applyProps = applyDefaultProps
    }

    applyProps(instance, {}, className ? cssProps : props)
  }

  return instance
}

/**
 * Create Component
 *
 * @param {string} type
 * @param {Object} lifecycle methods
 */
export function PixiComponent(type, lifecycle) {
  invariant(!!type, 'Expect type to be defined, got `%s`', type)
  invariant(!TYPES[type], 'Component `%s` could not be created, already exists in default components.', type)

  TYPES_INJECTED[type] = lifecycle

  return type
}
