import * as PIXI from 'pixi.js'

const BitmapText = (root, props) => {
  const { text, style } = props
  return new PIXI.extras.BitmapText(text, style)
}

export default BitmapText
