import * as PIXI from 'pixi.js'
import invariant from 'fbjs/lib/invariant'
import { getTextureFromProps } from '../utils'

const Rope = (root, props) => {
  const texture = getTextureFromProps('Rope', props)
  const { points } = props

  invariant(Array.isArray(points), 'Rope points needs to be %s', 'Array<PIXI.Point>')
  return new PIXI.mesh.Rope(texture, points)
}

export default Rope
