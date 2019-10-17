import { Graphics as PixiGraphics } from 'pixi.js'
import { applyDefaultProps } from '../utils/props'

const Graphics = (root, props) => {
  const g = new PixiGraphics()
  let drawn = false
  g.applyProps = (instance, oldProps, newProps) => {
    const { preventRedraw, draw, ...props } = newProps
    applyDefaultProps(instance, oldProps, props)

    if (draw && typeof draw === 'function' && (!drawn || !preventRedraw)) {
      draw.call(g, g)
      drawn = true
    }
  }

  return g
}

export default Graphics
