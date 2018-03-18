import * as PIXI from 'pixi.js';
import { getTextureFromProps } from '../utils';

var Mesh = function Mesh(root, props) {
  var texture = getTextureFromProps('Mesh', props);
  return new PIXI.mesh.Mesh(texture);
};

export default Mesh;