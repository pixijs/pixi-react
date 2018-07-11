import * as PIXI from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const Sprite = (root, props) => {
  const sprite = new PIXI.Sprite(getTextureFromProps('Sprite', props))

  sprite.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)

    if ((texture && oldProps.texture !== newProps.texture) || (image && oldProps.image !== newProps.image)) {
      instance.texture = getTextureFromProps('Sprite', newProps)
    }
  }

  return sprite
}

export default Sprite
