import * as PIXI from 'pixi.js';
import { getTextureFromProps } from '../utils';
import omit from 'lodash/omit';

var TilingSprite = function TilingSprite(root, props) {
  var _props$width = props.width,
      width = _props$width === void 0 ? 100 : _props$width,
      _props$height = props.height,
      height = _props$height === void 0 ? 100 : _props$height;
  var texture = getTextureFromProps('TilingSprite', props);
  var ts = new PIXI.extras.TilingSprite(texture, width, height); // apply remaining prop members

  var members = omit(props, 'width', 'height', 'texture', 'image');
  Object.keys(members).forEach(function (m) {
    ts[m] = members[m];
  });
  return ts;
};

export default TilingSprite;