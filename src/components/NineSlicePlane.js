import * as PIXI from 'pixi.js'
import { getTextureFromProps } from '../utils/props'

const NineSlicePlane = (root, props) => {
  const { leftWidth = 10, topHeight = 10, rightWidth = 10, bottomHeight = 10 } = props
  const texture = getTextureFromProps('NineSlicePlane', props)

  return new PIXI.mesh.NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight)
}

export default NineSlicePlane
