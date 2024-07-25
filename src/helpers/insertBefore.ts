import {
    Container,
    Filter,
} from 'pixi.js';
import { attach } from './attach.ts';
import { detach } from './detach.ts';
import { invariant } from './invariant.ts';
import { log } from './log.ts';

import type { HostConfig } from '../typedefs/HostConfig.ts';

export function insertBefore(
    parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
    beforeChildInstance: HostConfig['instance'],
)
{
    log('info', 'lifecycle::insertBefore');

    invariant(childInstance !== beforeChildInstance, 'Cannot insert node before itself');

    if (childInstance instanceof Container)
    {
        const childContainerInstance = childInstance as HostConfig['containerInstance'];
        const childContainer = childInstance as unknown as Container;

        if (childContainerInstance.parent === parentInstance)
        {
            parentInstance.removeChild(childContainer);
        }

        const index = parentInstance.getChildIndex(childContainer);

        parentInstance.addChildAt(childContainer, index);
    }
    else if (childInstance instanceof Filter)
    {
        const childFilterInstance = childInstance as HostConfig['filterInstance'];
        const instanceState = childFilterInstance.__pixireact;

        const targetIndex = instanceState.filters.indexOf(beforeChildInstance as unknown as Filter);

        detach(childInstance);
        attach(parentInstance, childInstance, targetIndex);
    }
}
