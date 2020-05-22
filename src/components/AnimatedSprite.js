import { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const AnimatedSprite = (root, props) => {
  const { textures, images, autoUpdate, isPlaying = true, initialFrame } = props
  const makeTexture = textures => textures.map(texture => getTextureFromProps('AnimatedSprite', { texture }))

  const animatedSprite = images ? PixiAnimatedSprite.fromImages(images) : new PixiAnimatedSprite(makeTexture(textures))
  animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0)
  animatedSprite.applyProps = (instance, oldProps, newProps) => {
    const { textures, isPlaying, initialFrame, ...props } = newProps

    applyDefaultProps(instance, oldProps, props)

    if (textures && oldProps['textures'] !== textures) {
      instance.textures = makeTexture(textures)
    }

    if (isPlaying !== oldProps.isPlaying || initialFrame !== oldProps.initialFrame) {
      const frame = typeof initialFrame === 'number' ? initialFrame : animatedSprite.currentFrame || 0
      animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](frame)
    }
  }

  return animatedSprite
}

export default AnimatedSprite
