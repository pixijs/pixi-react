import * as PIXI from 'pixi.js'

const Graphics = (root, props) => {
  const g = new PIXI.Graphics()

  if (props.draw) {
    props.draw.call(g)
  }

  return g
}

export default Graphics
