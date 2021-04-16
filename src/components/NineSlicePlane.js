import { NineSlicePlane as PixiNineSlicePlane } from 'pixi.js'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const NineSlicePlane = (root, props) => {
  const { leftWidth = 10, topHeight = 10, rightWidth = 10, bottomHeight = 10 } = props
  const texture = getTextureFromProps('NineSlicePlane', props)

  const nineSlicePlane = new PixiNineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight)

  nineSlicePlane.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    let changed = applyDefaultProps(instance, oldProps, props)

    if (image || texture) {
      // change = true not required for image, getTextureFromProps will call update
      if (texture !== oldProps.texture) {
        changed = true
      }
      instance.texture = getTextureFromProps('NineSlicePlane', newProps)
    }

    return changed
  }

  return nineSlicePlane
}

export default NineSlicePlane
