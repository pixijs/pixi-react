import Reconciler from 'react-reconciler';
import { makeHostConfig } from './hostconfig';
import rootPackageJson from '../../../package.json';
import packageJson from '../package.json';

export const REACT_DOM_VERSION = rootPackageJson.dependencies[
    'react-dom'
].replace(/[^0-9.]/g, '');
export const VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;

export function configurePixiReactHostConfig({ COMPONENTS, applyDefaultProps, diffProperties })
{
    return makeHostConfig({ COMPONENTS, applyDefaultProps, diffProperties });
}

export function configurePixiReactFiber(hostConfig)
{
    const PixiReactFiber = Reconciler(hostConfig);

    PixiReactFiber.injectIntoDevTools({
        bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
        version: REACT_DOM_VERSION,
        rendererPackageName: PACKAGE_NAME,
        findHostInstanceByFiber: PixiReactFiber.findHostInstance,
    });

    return PixiReactFiber;
}
