import {
  BitmapText,
  Container,
  Graphics,
  NineSlicePlane,
  ParticleContainer,
  Sprite,
  Stage,
  Text,
  TilingSprite,
} from '../components'

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

export function createElement(type, props, root) {
  const ELEMENTS = {
    BitmapText,
    Container,
    Graphics,
    NineSlicePlane,
    ParticleContainer,
    Sprite,
    Stage,
    Text,
    TilingSprite,
    default: undefined,
  }

  const ins = ELEMENTS[type]
  return ins && typeof ins === 'function' ? ins(root, props) : ELEMENTS.default
}
