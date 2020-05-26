import invariant from 'fbjs/lib/invariant'
import { Container } from 'pixi.js'
import { PixiFiber, PACKAGE_NAME, REACT_DOM_VERSION } from '../reconciler'

// cache root containers
export const roots = new Map()

/**
 * Custom Renderer
 * Use this without React-DOM
 *
 * @param {*} element
 * @param {PIXI.Container} container (i.e. the Stage)
 * @param {Function} callback
 * @param eventsMap
 */
export function render(element, container, callback = undefined, eventsMap = {}) {
  invariant(
    Container.prototype.isPrototypeOf(container),
    'Invalid argument `container`, expected instance of `PIXI.Container`.'
  )

  let root = roots.get(container)
  let fiber = PixiFiber(eventsMap)

  if (!root) {
    // get the flushed fiber container
    root = fiber.createContainer(container)
    roots.set(container, root)
  }

  // schedules a top level update
  fiber.updateContainer(element, root, undefined, callback)

  // inject into react devtools
  injectDevtools(fiber)

  // return the root instance
  return fiber.getPublicRootInstance(root)
}

/**
 * Inject into React Devtools
 */
export function injectDevtools(fiber) {
  fiber.injectIntoDevTools({
    bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
    version: REACT_DOM_VERSION,
    rendererPackageName: PACKAGE_NAME,
    findHostInstanceByFiber: PixiFiber.findHostInstance,
  })
}
