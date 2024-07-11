import { log } from './log.ts';

import type { Instance } from '../typedefs/Instance.js';

/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */

/**
 * Adds elements to our application.
 *
 * @param {Instance} parentInstance
 * @param {Instance | null} childInstance
 */
export function appendChild(parentInstance: Instance, childInstance: Instance | null)
{
    log('info', 'lifecycle::appendChild');

    if (!childInstance)
    {
        return;
    }

    parentInstance.addChild(childInstance);
}
