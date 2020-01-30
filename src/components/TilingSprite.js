import { TilingSprite as PixiTilingSprite, DisplayObject } from 'pixi.js'
import { getTextureFromProps } from '../utils/props'
import { parsePoint } from '../utils/pixi'

PixiTilingSprite.prototype.reactApplyProps = function(oldProps, newProps) {
  const { tileScale, tilePosition, image, texture, ...props } = newProps
  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if (tilePosition) {
    this.tilePosition.set(...parsePoint(tilePosition))
  }

  if (tileScale) {
    this.tileScale.set(...parsePoint(tileScale))
  }

  if (image || texture) {
    this.texture = getTextureFromProps('Sprite', newProps)
  }
}

const TilingSprite = (root, props) => {
  const { width = 100, height = 100 } = props
  const texture = getTextureFromProps('TilingSprite', props)

  const ts = new PixiTilingSprite(texture, width, height)

  return ts
}

export default TilingSprite
