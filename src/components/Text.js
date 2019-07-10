import { Text as PixiText } from 'pixi.js-legacy'

const Text = (root, props) => {
  const { text = '', style = {} } = props
  return new PixiText(text, style) // TODO: ask @inlet why it does not print bouh
}

export default Text
