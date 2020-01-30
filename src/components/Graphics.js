import { Graphics as PixiGraphics, DisplayObject } from 'pixi.js'

const Graphics = (root, props) => new PixiGraphics()

PixiGraphics.prototype.reactApplyProps = function(oldProps, newProps) {
  const { draw, ...props } = newProps

  DisplayObject.prototype.reactApplyProps.call(this, oldProps, props)

  if (oldProps.draw !== draw && typeof draw === 'function') {
    draw.call(this, this)
  }
}

export default Graphics
