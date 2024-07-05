import { invariant } from './invariant.js';
import { log } from './log.js';

/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */

/**
 * @param {Instance} parentInstance
 * @param {Instance} childInstance
 * @param {Instance} beforeChildInstance
 */
export function insertBefore(parentInstance, childInstance, beforeChildInstance)
{
    log('info', 'lifecycle::insertBefore');

    invariant(childInstance !== beforeChildInstance, 'Cannot insert node before itself');

    if (parentInstance.children.indexOf(childInstance) === -1)
    {
        parentInstance.removeChild(childInstance);
    }

    const index = parentInstance.getChildIndex(beforeChildInstance);

    parentInstance.addChildAt(childInstance, index);
}
