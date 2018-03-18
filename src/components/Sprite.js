import * as PIXI from 'pixi.js'
import { getTextureFromProps } from '../utils'

const Sprite = (root, props) => {
  const texture = getTextureFromProps('Sprite', props)
  return new PIXI.Sprite(texture)
}

export default Sprite
