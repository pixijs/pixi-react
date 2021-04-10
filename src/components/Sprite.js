import { Sprite as PixiSprite } from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const Sprite = (root, props) => {
  const sprite = new PixiSprite(getTextureFromProps('Sprite', props))

  sprite.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    let changed = applyDefaultProps(instance, oldProps, props)

    if ((texture && oldProps.texture !== newProps.texture) || (image && oldProps.image !== newProps.image)) {
      // getTextureFromProps will call update for image
      if (oldProps.texture !== newProps.texture) {
        changed = true
      }
      instance.texture = getTextureFromProps('Sprite', newProps)
    }

    return changed
  }

  return sprite
}

export default Sprite
