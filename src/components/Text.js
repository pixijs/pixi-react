import { Text as PixiText } from 'pixi.js'

const Text = (root, props) => {
  const { text = '', style = {} } = props
  return new PixiText(text, style)
}

export default Text
