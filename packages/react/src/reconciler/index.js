import Reconciler from 'react-reconciler';
import pkg from '../../../../package.json';
import hostconfig from './hostconfig';

export const PixiFiber = Reconciler(hostconfig);

export const VERSION = pkg.version;
export const REACT_DOM_VERSION = pkg.dependencies['react-dom'].replace(/[^0-9.]/g, '');
export const PACKAGE_NAME = pkg.name;

PixiFiber.injectIntoDevTools({
    bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
    version: REACT_DOM_VERSION,
    rendererPackageName: PACKAGE_NAME,
    findHostInstanceByFiber: PixiFiber.findHostInstance,
});
