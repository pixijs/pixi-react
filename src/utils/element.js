import { applyDefaultProps } from './props'
import * as components from '../components'
import idx from 'idx'

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
  Shape: 'Shape',
  Mesh: 'Mesh',
  Rope: 'Rope',
}

const ELEMENTS = Object.keys(TYPES).reduce(
  (elements, type) => ({ ...elements, [type]: components[type] }),
  {}
)

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
  }

  // apply initial props!
  if (instance) {
    applyProps = idx(instance, _ => _.applyProps)
    if (typeof applyProps !== 'function') {
      applyProps = (a, b) => applyDefaultProps(instance, a, b)
    }
    applyProps({}, props)
  }

  return instance
}
