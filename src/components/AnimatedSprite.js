import { AnimatedSprite as PixiAnimatedSprite, DisplayObject } from 'pixi.js'
import { getTextureFromProps } from '../utils/props'

const makeTexture = textures => textures.map(texture => getTextureFromProps('AnimatedSprite', { texture }))

const AnimatedSprite = (root, props) => {
  const { textures, images, autoUpdate, isPlaying = true, initialFrame } = props

  const animatedSprite = images ? PixiAnimatedSprite.fromImages(images) : new PixiAnimatedSprite(makeTexture(textures))
  animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0)

  return animatedSprite
}

PixiAnimatedSprite.prototype.reactApplyProps = function(oldProps, newProps) {
  const { textures, isPlaying, initialFrame, ...props } = newProps

  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if (textures && oldProps.textures !== textures) {
    this.textures = makeTexture(textures)
  }

  if (isPlaying !== oldProps.isPlaying || initialFrame !== oldProps.initialFrame) {
    const frame = typeof initialFrame === 'number' ? initialFrame : this.currentFrame || 0
    this[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](frame)
  }
}

export default AnimatedSprite
