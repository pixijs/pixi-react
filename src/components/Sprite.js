import * as PIXI from 'pixi.js'
import { getTextureFromProps } from '../utils/props'

const Sprite = (root, props) => {
  const texture = getTextureFromProps('Sprite', props)
  return new PIXI.Sprite(texture)
}

export default Sprite
