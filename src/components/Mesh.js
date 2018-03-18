import * as PIXI from 'pixi.js'
import { getTextureFromProps } from '../utils'

const Mesh = (root, props) => {
  const texture = getTextureFromProps('Mesh', props)
  return new PIXI.mesh.Mesh(texture)
}

export default Mesh
