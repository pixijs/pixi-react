import { log } from './log.js';

/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */

/**
 * Removes elements from our scene and disposes of them.
 *
 * @param {Instance} _parentInstance The parent instance.
 * @param {Instance} childInstance The child instance to be removed.
 */
export function removeChild(_parentInstance, childInstance)
{
    log('info', 'lifecycle::removeChild');
    childInstance.destroy();
}
