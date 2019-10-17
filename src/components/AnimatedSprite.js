import * as PIXI from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const AnimatedSprite = (root, props) => {
  const { textures, images, autoUpdate, isPlaying = true, initialFrame } = props
  const makeTexture = (textures) => {
    return textures.map(texture => {
      return getTextureFromProps('AnimatedSprite', {
        texture,
      })
    })
  }
  const animatedSprite = images
    ? PIXI.AnimatedSprite.fromImages(images)
    : new PIXI.AnimatedSprite(makeTexture(textures))
  animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0)
  animatedSprite.applyProps = (instance, oldProps, newProps) => {
    const { textures, ...props } = newProps
    const { isPlaying, initialFrame } = props
    applyDefaultProps(instance, oldProps, props)
    if(textures) {
      instance.textures = makeTexture(textures)
      animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0)
    }
  }

  return animatedSprite
}

export default AnimatedSprite
