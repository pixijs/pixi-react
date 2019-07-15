import invariant from 'fbjs/lib/invariant'
import { Container } from 'pixi.js'
import { PixiFiber, PACKAGE_NAME, VERSION } from '../reconciler'

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
export function render(element, container, callback = undefined) {
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

  // inject into react devtools
  injectDevtools()

  // return the root instance
  return PixiFiber.getPublicRootInstance(root)
}

/**
 * Inject into React Devtools
 */
export function injectDevtools() {
  PixiFiber.injectIntoDevTools({
    bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
    version: VERSION,
    rendererPackageName: PACKAGE_NAME,
    findHostInstanceByFiber: PixiFiber.findHostInstance,
  })
}
