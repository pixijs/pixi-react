import * as PIXI from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const AnimatedSprite = (root, props) => {
  const { textures, images, autoUpdate, isPlaying = true, initialFrame } = props
  const animatedSprite = images
    ? PIXI.AnimatedSprite.fromImages(images)
    : new PIXI.AnimatedSprite(
        textures.map(texture => {
          return getTextureFromProps('AnimatedSprite', {
            texture,
          })
        })
      )
  animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0)
  animatedSprite.applyProps = (instance, oldProps, newProps) => {
    const { textures, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)
  }

  return animatedSprite
}

export default AnimatedSprite
