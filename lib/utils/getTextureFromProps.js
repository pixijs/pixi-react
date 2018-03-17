import "core-js/modules/es6.symbol";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import * as PIXI from 'pixi.js';
import invariant from 'fbjs/lib/invariant';

var getTextureFromProps = function getTextureFromProps(elementType, _ref) {
  var texture = _ref.texture,
      image = _ref.image;

  if (image) {
    invariant(typeof image === 'string', elementType + ' image needs to be a string, got `%s`', _typeof(image));
    return PIXI.Texture.fromImage(image);
  }

  invariant(texture instanceof PIXI.Texture, elementType + ' texture needs to be type of `PIXI.Texture`');
  return texture;
};

export default getTextureFromProps;