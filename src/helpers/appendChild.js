import { log } from './log.js';

/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */

/**
 * Adds elements to our application.
 *
 * @param {Instance} parentInstance
 * @param {Instance | null} childInstance
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
