import { log } from './log.js';

/** @typedef {import('pixi.js').Container} Container */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */

/**
 * Adds elements to our application.
 *
 * @param {Instance} parentInstance
 * @param {Instance} childInstance
 */
export function appendChild(parentInstance, childInstance)
{
    log('info', 'lifecycle::appendChild');

    if (!childInstance)
    {
        return;
    }

    parentInstance.addChild(childInstance);
}
