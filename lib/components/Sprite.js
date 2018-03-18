import * as PIXI from 'pixi.js';
import { getTextureFromProps } from '../utils';

var Sprite = function Sprite(root, props) {
  var texture = getTextureFromProps('Sprite', props);
  return new PIXI.Sprite(texture);
};

export default Sprite;