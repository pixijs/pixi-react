import * as PIXI from 'pixi.js'
import invariant from 'fbjs/lib/invariant'
import { getTextureFromProps, applyDefaultProps } from '../utils/props'

const Rope = (root, props) => {
  const texture = getTextureFromProps('Rope', props)
  const { points } = props

  const rope = new PIXI.mesh.Rope(texture, points)

  rope.applyProps = (instance, oldProps, newProps) => {
    const { image, texture, ...props } = newProps

    invariant(Array.isArray(newProps.points), 'Rope points needs to be %s', 'Array<PIXI.Point>')
    applyDefaultProps(instance, oldProps, props)

    if (image || texture) {
      instance.texture = getTextureFromProps('Rope', newProps)
    }
  }

  return rope
}

export default Rope
