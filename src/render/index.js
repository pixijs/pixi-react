import invariant from '../utils/invariant'
import { Container } from 'pixi.js'
import { PixiFiber } from '../reconciler'

// cache root containers
export const roots = new Map()

/**
 * Custom Renderer
 * Use this without React-DOM
 *
 * @param {*} element
 * @param {PIXI.Container} container (i.e. the Stage)
 * @param {Function} callback
 */
export function render(element, container, callback = () => {}) {
  invariant(
    Container.prototype.isPrototypeOf(container),
    'Invalid argument `container`, expected instance of `PIXI.Container`.'
  )

  let root = roots.get(container)

  if (!root) {
    // get the flushed fiber container
    root = PixiFiber.createContainer(container)
    roots.set(container, root)
  }

  // schedules a top level update
  PixiFiber.updateContainer(element, root, undefined, callback)

  // return the root instance
  return PixiFiber.getPublicRootInstance(root)
}

export function unmountComponentAtNode(container) {
  if (roots.has(container)) {
    // unmount component
    PixiFiber.updateContainer(null, roots.get(container), undefined, () => {
      roots.delete(container)
    })
  }
}
