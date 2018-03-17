import * as PIXI from 'pixi.js';
import { getTextureFromProps } from '../utils';

var NineSlicePlane = function NineSlicePlane(root, props) {
  var _props$leftWidth = props.leftWidth,
      leftWidth = _props$leftWidth === void 0 ? 10 : _props$leftWidth,
      _props$topHeight = props.topHeight,
      topHeight = _props$topHeight === void 0 ? 10 : _props$topHeight,
      _props$rightWidth = props.rightWidth,
      rightWidth = _props$rightWidth === void 0 ? 10 : _props$rightWidth,
      _props$bottomHeight = props.bottomHeight,
      bottomHeight = _props$bottomHeight === void 0 ? 10 : _props$bottomHeight;
  var texture = getTextureFromProps('NineSlicePlane', props);
  return new PIXI.mesh.NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight);
};

export default NineSlicePlane;