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
  (elements, type) => ({ ...elements, [type]: require('../components')[type] }),
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
  const ins = ELEMENTS[type]

  if (typeof ins === 'function') {
    return ins(root, props)
  }

  // custom component?

  return undefined
}
