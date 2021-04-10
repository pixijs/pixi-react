import { SimpleMesh as PixiSimpleMesh, DRAW_MODES } from 'pixi.js'
import { applyDefaultProps, getTextureFromProps } from '../utils/props'

const SimpleMesh = (root, props) => {
  const texture = getTextureFromProps('Mesh', props)
  const { vertices, uvs, indices, drawMode = DRAW_MODES.TRIANGLES } = props

  const simpleMesh = new PixiSimpleMesh(texture, vertices, uvs, indices, drawMode)

  simpleMesh.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    let changed = applyDefaultProps(instance, oldProps, props)

    if (image || texture) {
      // change = true not required for image, getTextureFromProps will call update
      if (texture !== oldProps.texture) {
        changed = true
      }
      instance.texture = getTextureFromProps('Mesh', newProps)
    }

    return changed
  }

  return simpleMesh
}

export default SimpleMesh
