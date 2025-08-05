import { type Container, type Filter } from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';
import { attach } from './attach';
import { detach } from './detach';
import { invariant } from './invariant';
import { log } from './log';
import { isContainer, isFilter } from './typeChecks';

export function insertBefore(
    parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
    beforeChildInstance: HostConfig['instance'],
)
{
    log('info', 'lifecycle::insertBefore');

    invariant(childInstance !== beforeChildInstance, 'Cannot insert node before itself');

    if (isContainer(childInstance))
    {
        const childContainerInstance = childInstance as HostConfig['containerInstance'];
        const childContainer = childInstance as unknown as Container;
        const beforeChildContainer = beforeChildInstance as unknown as Container;

        if (childContainerInstance.parent === parentInstance)
        {
            parentInstance.removeChild(childContainer);
        }

        const index = parentInstance.getChildIndex(beforeChildContainer);

        parentInstance.addChildAt(childContainer, index);
    }
    else if (isFilter(childInstance))
    {
        const childFilterInstance = childInstance;
        const instanceState = childFilterInstance.__pixireact;

        const targetIndex = instanceState.filters.indexOf(beforeChildInstance as unknown as Filter);

        detach(childInstance);
        attach(parentInstance, childInstance, targetIndex);
    }
}
