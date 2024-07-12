import {
    Container,
    Filter,
} from 'pixi.js';
import { attach } from './attach.ts';
import { detach } from './detach.ts';
import { invariant } from './invariant.ts';
import { log } from './log.ts';

import type { ContainerElement } from '../typedefs/ContainerElement.ts';
import type { FilterElement } from '../typedefs/FilterElement.ts';
import type { Instance } from '../typedefs/Instance.ts';

export function insertBefore(parentInstance: Instance<ContainerElement>, childInstance: Instance, beforeChildInstance: Instance)
{
    log('info', 'lifecycle::insertBefore');

    invariant(childInstance !== beforeChildInstance, 'Cannot insert node before itself');

    if (childInstance instanceof Container)
    {
        const childContainerInstance = childInstance as Instance<ContainerElement>;

        if (childContainerInstance.parent === parentInstance)
        {
            parentInstance.removeChild(childContainerInstance);
        }

        const index = parentInstance.getChildIndex(beforeChildInstance as Instance<ContainerElement>);

        parentInstance.addChildAt(childContainerInstance, index);
    }
    else if (childInstance instanceof Filter)
    {
        const childFilterInstance = childInstance as Instance<FilterElement>;
        const instanceState = childFilterInstance.__pixireact;

        const targetIndex = instanceState.filters.indexOf(beforeChildInstance as Instance<FilterElement>);

        detach(childInstance);
        attach(parentInstance, childInstance, targetIndex);
    }
}
