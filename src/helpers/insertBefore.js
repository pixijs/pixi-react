import { invariant } from './invariant.js';
import { log } from './log.js';

/** @typedef {import('pixi.js').Container} Container */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */

/**
 * @param {Instance} parentInstance
 * @param {Instance} childInstance
 * @param {Instance} beforeChildInstance
 */
export function insertBefore(parentInstance, childInstance, beforeChildInstance)
{
    log('info', 'lifecycle::insertBefore');

    invariant(childInstance === beforeChildInstance, 'Cannot insert node before itself');

    const { component: parentComponent } = parentInstance;
    const { component: childComponent } = childInstance;
    const { component: beforeChildComponent } = beforeChildInstance;

    if (parentComponent.children.indexOf(childComponent) === -1)
    {
        parentInstance.removeChild(childInstance);
    }

    const index = parentComponent.getChildIndex(beforeChildComponent);

    parentInstance.addChild(childInstance, index);
}
