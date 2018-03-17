import * as PIXI from 'pixi.js';
import { getTextureFromProps } from '../utils';
import { omit } from 'lodash-es';

var TilingSprite = function TilingSprite(root, props) {
  var width = props.width,
      height = props.height;
  var texture = getTextureFromProps('TilingSprite', props);
  var ts = new PIXI.extras.TilingSprite(texture, width, height); // apply remaining prop members

  var members = omit(props, 'width', 'height', 'texture', 'image');
  Object.keys(members).forEach(function (m) {
    ts[m] = members[m];
  });
  return ts;
};

export default TilingSprite;