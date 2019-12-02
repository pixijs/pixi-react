import { Text as PixiText, Sprite as PixiSprite } from 'pixi.js'

const Text = (root, props) => {
  const { text = '', style = {}, isSprite } = props
  const pixiText = new PixiText(text, style)
  if (isSprite) {
    pixiText.updateText()
    return new PixiSprite(pixiText.texture)
  }
  return pixiText
}

export default Text
