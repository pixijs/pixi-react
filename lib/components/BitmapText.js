import * as PIXI from 'pixi.js';

var BitmapText = function BitmapText(root, props) {
  var text = props.text,
      style = props.style;
  return new PIXI.extras.BitmapText(text, style);
};

export default BitmapText;