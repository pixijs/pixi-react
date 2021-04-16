import { Graphics as PixiGraphics } from 'pixi.js'
import { applyDefaultProps } from '../utils/props'

const Graphics = (root, props) => {
  const g = new PixiGraphics()
  g.applyProps = (instance, oldProps, newProps) => {
    const { draw, ...props } = newProps
    let changed = applyDefaultProps(instance, oldProps, props)

    if (oldProps.draw !== draw && typeof draw === 'function') {
      changed = true
      draw.call(g, g)
    }

    return changed
  }

  return g
}

export default Graphics
