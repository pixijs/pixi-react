import * as PIXI from 'pixi.js';
import invariant from 'fbjs/lib/invariant';
import { getTextureFromProps } from '../utils';

var Rope = function Rope(root, props) {
  var texture = getTextureFromProps('Rope', props);
  var points = props.points;
  invariant(Array.isArray(points), 'Rope points needs to be %s', 'Array<PIXI.Point>');
  return new PIXI.mesh.Rope(texture, points);
};

export default Rope;