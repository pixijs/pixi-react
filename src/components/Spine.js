import { Container as PixiContainer } from 'pixi.js'

const Spine = (root, props) => {
  const { autoPlay = true, animations = [], animationEnd, spineElement, skin } = props

  let container = spineElement.getSpineObject()

  if (autoPlay) {
    spineElement.play()
  }

  container.willUnmount = (instance, child, parent) => {
    spineElement.destroy()
    instance.destroy()
  }

  return container
}

export default Spine
