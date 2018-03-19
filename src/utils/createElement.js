export const TYPES = {
  BitmapText: 'BitmapText',
  Container: 'Container',
  Graphics: 'Graphics',
  NineSlicePlane: 'NineSlicePlane',
  ParticleContainer: 'ParticleContainer',
  Sprite: 'Sprite',
  Stage: 'Stage',
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

export function createElement(type, props, root) {
  const ins = ELEMENTS[type]
  return ins && typeof ins === 'function' ? ins(root, props || {}) : ELEMENTS.default
}
