import { SimpleRope as PixiSimpleRope, DisplayObject } from 'pixi.js'
import invariant from 'fbjs/lib/invariant'
import { getTextureFromProps } from '../utils/props'

PixiSimpleRope.prototype.reactApplyProps = function(oldProps, newProps) {
  const { image, texture, ...props } = newProps
  invariant(Array.isArray(newProps.points), 'SimpleRope points needs to be %s', 'Array<PIXI.Point>')
  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if (image || texture) {
    this.texture = getTextureFromProps('SimpleRope', newProps)
  }
}

const SimpleRope = (root, props) => {
  const texture = getTextureFromProps('SimpleRope', props)
  const { points } = props

  const rope = new PixiSimpleRope(texture, points)

  return rope
}

export default SimpleRope
