import { NineSlicePlane as PixiNineSlicePlane, DisplayObject } from 'pixi.js'
import { getTextureFromProps } from '../utils/props'

PixiNineSlicePlane.prototype.reactApplyProps = function(oldProps, newProps) {
  const { image, texture, ...props } = newProps
  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if (image || texture) {
    this.texture = getTextureFromProps('NineSlicePlane', newProps)
  }
}

const NineSlicePlane = (root, props) => {
  const { leftWidth = 10, topHeight = 10, rightWidth = 10, bottomHeight = 10 } = props
  const texture = getTextureFromProps('NineSlicePlane', props)

  const nineSlicePlane = new PixiNineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight)

  return nineSlicePlane
}

export default NineSlicePlane
