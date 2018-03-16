import pkg from '../package.json'
import ReactPixiFiber from './ReactPixiFiber'
import { isProd } from './utils'

export const roots = new Map()

/*
 * element should be any instance of PIXI DisplayObject
 * containerTag should be an instance of PIXI root Container (i.e. the Stage)
 */
function render(element, containerTag, callback) {
  let root = roots.get(containerTag)
  if (!root) {
    root = ReactPixiFiber.createContainer(containerTag)
    roots.set(containerTag, root)
  }

  ReactPixiFiber.updateContainer(element, root, undefined, callback)

  ReactPixiFiber.injectIntoDevTools({
    findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
    bundleType: !isProd ? 1 : 0,
    version: pkg.version,
    rendererPackageName: pkg.name,
  })

  return ReactPixiFiber.getPublicRootInstance(root)
}

export default render
