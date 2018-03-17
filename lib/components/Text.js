import * as PIXI from 'pixi.js';

var Text = function Text(root, props) {
  var _props$text = props.text,
      text = _props$text === void 0 ? '' : _props$text,
      _props$style = props.style,
      style = _props$style === void 0 ? {} : _props$style;
  return new PIXI.Text(text, style);
};

export default Text;