import * as PIXI from 'pixi.js'
import { applyDefaultProps, getTextureFromProps } from '../utils/props'

const Mesh = (root, props) => {
  const mesh = new PIXI.mesh.Mesh(getTextureFromProps('Mesh', props))

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
