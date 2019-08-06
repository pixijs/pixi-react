import invariant from 'fbjs/lib/invariant'
import idx from 'idx'
import { applyDefaultProps } from './props'
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
export function createElement(type, props = {}, root = null) {
  const fn = ELEMENTS[type]

  let instance
  let applyProps

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
    applyProps = idx(instance, _ => _.applyProps)
    if (typeof applyProps !== 'function') {
      applyProps = applyDefaultProps
    }
    applyProps(instance, {}, props)
  }

  return instance
}

/**
 * Register Component
 *
 * @param {string} type
 * @param {Object} lifecycle methods
 */
export function registerComponent(type, lifecycle) {
  invariant(!!type, 'Expect type to be defined, got `%s`', type)
  invariant(!TYPES[type], 'Component `%s` could not be created, already exists in default components.', type)

  TYPES_INJECTED[type] = lifecycle
}

/**
 * Override existing components.
 *
 * This is not recommended usage, please ensure you know what you are doing before using this!
 *
 * @param {string} type
 * @param {Object} lifecycle methods
 */
export function overrideComponent(type, lifecycle) {
  invariant(!!type, 'Expect type to be defined, got `%s`', type)

  if (TYPES[type]) {
    TYPES[type] = lifecycle
  } else {
    TYPES_INJECTED[type] = lifecycle
  }
}

/**
 * Create Component
 *
 * @param {string} type
 * @param {Object} lifecycle methods
 */
export function PixiComponent(type, lifecycle) {
  this.registerComponent(type, lifecycle)

  return type
}
