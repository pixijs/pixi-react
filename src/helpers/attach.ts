import { Filter } from 'pixi.js';

import type { ContainerElement } from '../typedefs/ContainerElement.ts';
import type { Instance } from '../typedefs/Instance.ts';

export function attach(
    parentInstance: Instance<ContainerElement>,
    childInstance: Instance,
    targetIndex?: number
)
{
    if (childInstance instanceof Filter)
    {
        childInstance.__pixireact.parent = parentInstance;

        if (typeof targetIndex === 'number')
        {
            parentInstance.__pixireact.filters.splice(targetIndex, 0, childInstance);
        }
        else
        {
            parentInstance.__pixireact.filters.push(childInstance);
        }

        parentInstance.filters = parentInstance.__pixireact.filters;
    }
}
