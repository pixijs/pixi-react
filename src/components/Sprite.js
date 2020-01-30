import { Sprite as PixiSprite, DisplayObject } from 'pixi.js'
import { getTextureFromProps } from '../utils/props'

PixiSprite.prototype.reactApplyProps = function(oldProps, newProps) {
  const { image, texture, ...props } = newProps
  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if ((texture && oldProps.texture !== newProps.texture) || (image && oldProps.image !== newProps.image)) {
    this.texture = getTextureFromProps('Sprite', newProps)
  }
}

const Sprite = (root, props) => {
  const sprite = new PixiSprite(getTextureFromProps('Sprite', props))

  return sprite
}

export default Sprite
