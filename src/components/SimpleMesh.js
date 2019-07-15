import { SimpleMesh as PixiSimpleMesh, DRAW_MODES } from 'pixi.js'
import { applyDefaultProps, getTextureFromProps } from '../utils/props'

const SimpleMesh = (root, props) => {
  const texture = getTextureFromProps('Mesh', props)
  const { vertices, uvs, indices, drawMode = DRAW_MODES.TRIANGLES } = props

  const simpleMesh = new PixiSimpleMesh(texture, vertices, uvs, indices, drawMode)

  simpleMesh.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)

    if (image || texture) {
      instance.texture = getTextureFromProps('Mesh', newProps)
    }
  }

  return simpleMesh
}

export default SimpleMesh
