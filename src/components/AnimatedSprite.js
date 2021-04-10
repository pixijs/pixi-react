import { AnimatedSprite as PixiAnimatedSprite, Texture } from 'pixi.js'
import { applyDefaultProps } from '../utils/props'
import invariant from '../utils/invariant'

const AnimatedSprite = (root, props) => {
  const { textures, images, isPlaying = true, initialFrame } = props

  const makeTexture = textures =>
    textures.map(texture => {
      invariant(
        texture instanceof Texture || texture?.texture,
        `AnimationSprite texture needs to be an array of \`PIXI.Texture\` or \`{ texture: PIXI.Texture, time: number }\``
      )
      return texture
    })

  const animatedSprite = images ? PixiAnimatedSprite.fromImages(images) : new PixiAnimatedSprite(makeTexture(textures))
  animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0)
  animatedSprite.applyProps = (instance, oldProps, newProps) => {
    const { textures, isPlaying, initialFrame, ...props } = newProps

    let changed = applyDefaultProps(instance, oldProps, props)

    if (textures && oldProps['textures'] !== textures) {
      instance.textures = makeTexture(textures)
      changed = true
    }

    if (isPlaying !== oldProps.isPlaying || initialFrame !== oldProps.initialFrame) {
      const frame = typeof initialFrame === 'number' ? initialFrame : animatedSprite.currentFrame || 0
      animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](frame)
      changed = true
    }

    return changed
  }

  return animatedSprite
}

export default AnimatedSprite
