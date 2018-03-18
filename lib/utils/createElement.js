import { BitmapText, Container, Graphics, NineSlicePlane, ParticleContainer, Sprite, Stage, Text, TilingSprite, Mesh, Rope } from '../components';
export var TYPES = {
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
  Rope: 'Rope'
};
export function createElement(type, props, root) {
  var ELEMENTS = {
    BitmapText: BitmapText,
    Container: Container,
    Graphics: Graphics,
    NineSlicePlane: NineSlicePlane,
    ParticleContainer: ParticleContainer,
    Sprite: Sprite,
    Stage: Stage,
    Mesh: Mesh,
    Rope: Rope,
    Text: Text,
    TilingSprite: TilingSprite,
    default: undefined
  };
  var ins = ELEMENTS[type];
  return ins && typeof ins === 'function' ? ins(root, props || {}) : ELEMENTS.default;
}