import * as PIXI from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'
import { parsePoint } from '../utils/pixi'

const TilingSprite = (root, props) => {
  const { width = 100, height = 100 } = props
  const texture = getTextureFromProps('TilingSprite', props)

  const ts = new PIXI.extras.TilingSprite(texture, width, height)

  ts.applyProps = (instance, oldProps, newProps) => {
    const { tileScale, tilePosition, image, texture, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)

    if (tilePosition) {
      instance.tilePosition.set(...parsePoint(tilePosition))
    }

    if (tileScale) {
      instance.tileScale.set(...parsePoint(tileScale))
    }

    if (image || texture) {
      instance.texture = getTextureFromProps('Sprite', newProps)
    }
  }

  return ts
}

export default TilingSprite
