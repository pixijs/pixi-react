import { SimpleMesh as PixiSimpleMesh, DRAW_MODES, DisplayObject } from 'pixi.js'
import { getTextureFromProps } from '../utils/props'

PixiSimpleMesh.prototype.reactApplyProps = function(oldProps, newProps) {
  const { image, texture, ...props } = newProps
  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if (image || texture) {
    this.texture = getTextureFromProps('Mesh', newProps)
  }
}

const SimpleMesh = (root, props) => {
  const texture = getTextureFromProps('Mesh', props)
  const { vertices, uvs, indices, drawMode = DRAW_MODES.TRIANGLES } = props

  const simpleMesh = new PixiSimpleMesh(texture, vertices, uvs, indices, drawMode)

  return simpleMesh
}

export default SimpleMesh
