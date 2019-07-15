import * as PIXI from 'pixi.js'

const Star = (root, props) => {
  const { x, y, points, radius, innerRadius, color } = props

  const graphics = new PIXI.Graphics()
  graphics.beginFill(color)
  graphics.drawStar(x, y, points, radius, innerRadius)

  return graphics
}

export default Star
