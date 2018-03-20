import Reconciler from 'react-reconciler'
import pkg from '../../package.json'
import hostconfig from './hostconfig'

export const PixiFiber = Reconciler(hostconfig)
export const VERSION = pkg.version
export const PACKAGE_NAME = pkg.name
