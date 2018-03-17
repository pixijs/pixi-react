import * as PIXI from 'pixi.js';

var Graphics = function Graphics(root, props) {
  var g = new PIXI.Graphics();

  if (props.draw) {
    props.draw.call(g);
  }

  return g;
};

export default Graphics;