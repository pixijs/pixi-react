import * as PIXI from 'pixi.js'
import { applyDefaultProps, getTextureFromProps } from '../utils/props'

const Mesh = (root, props) => {
  const texture = getTextureFromProps('Mesh', props)
  const { vertices, uvs, indices, drawMode = PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES } = props

  const mesh = new PIXI.mesh.Mesh(texture, vertices, uvs, indices, drawMode)

  mesh.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)

    if (image || texture) {
      instance.texture = getTextureFromProps('Mesh', newProps)
    }
  }

  return mesh
}

export default Mesh
