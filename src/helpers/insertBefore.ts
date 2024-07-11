import { invariant } from './invariant.ts';
import { log } from './log.ts';

import type { Instance } from '../typedefs/Instance.ts';

export function insertBefore(parentInstance: Instance, childInstance: Instance, beforeChildInstance: Instance)
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
