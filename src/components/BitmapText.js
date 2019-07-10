import { BitmapText as PixiBitmapText } from 'pixi.js-legacy'

const BitmapText = (root, props) => {
  const { text, style } = props
  return new PixiBitmapText(text, style)
}

export default BitmapText
