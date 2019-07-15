import { NineSlicePlane as PixiNineSlicePlane } from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const NineSlicePlane = (root, props) => {
  const { leftWidth = 10, topHeight = 10, rightWidth = 10, bottomHeight = 10 } = props
  const texture = getTextureFromProps('NineSlicePlane', props)

  const nineSlicePlane = new PixiNineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight)

  nineSlicePlane.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)

    if (image || texture) {
      instance.texture = getTextureFromProps('NineSlicePlane', newProps)
    }
  }

  return nineSlicePlane
}

export default NineSlicePlane
