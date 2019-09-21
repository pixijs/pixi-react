import Reconciler from 'react-reconciler'
import pkg from '../../package.json'
import hostconfig from './hostconfig'

export const PixiFiber = Reconciler(hostconfig)
export const VERSION = pkg.version
export const REACT_DOM_VERSION = pkg.devDependencies['react-dom'].replace(/[^0-9.]/g, '')
export const PACKAGE_NAME = pkg.name
