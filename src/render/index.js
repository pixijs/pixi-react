import invariant from 'fbjs/lib/invariant'
import { Container } from 'pixi.js'
import PixiFiber, { PACKAGE_NAME, VERSION } from '../reconciler'

// cache root containers
export const roots = new Map()

/**
 * Renderer
 *
 * @param {any} element
 * @param {Container} container (i.e. the Stage)
 * @returns {Promise<void>}
 */
export async function render(element, container, callback) {
  invariant(container instanceof Container, 'Invalid argument `container`, expected instance of `PIXI.Container`.')

  let root = roots.get(container)
  if (!root) {
    // get the flushed fiber container
    root = PixiFiber.createContainer(container)
    roots.set(container, root)
  }

  // schedules a top level update
  PixiFiber.updateContainer(element, node, null, callback)

  // inject into react devtools
  PixiFiber.injectIntoDevTools({
    bundleType: process.env.NODE_ENV === 'development' ? 1 : 0,
    version: VERSION,
    rendererPackageName: PACKAGE_NAME,
    findHostInstanceByFiber: PixiFiber.findHostInstance,
  })

  // parse input and returns output here ?

  // return the root instance
  return PixiFiber.getPublicRootInstance(node)
}
