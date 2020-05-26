import Reconciler from 'react-reconciler'
import pkg from '../../package.json'
import hostconfig from './hostconfig'

/**
 * Create a reconciler with an optional events map.
 * The eventsMap is a simple lookup object to map reconciler methods to
 *
 * @param eventsMap
 * @return React reconciler
 */
export const PixiFiber = (eventsMap = {}) => {
  const config = hostconfig(eventsMap)
  return Reconciler(config)
}

export const VERSION = pkg.version
export const REACT_DOM_VERSION = pkg.devDependencies['react-dom'].replace(/[^0-9.]/g, '')
export const PACKAGE_NAME = pkg.name
