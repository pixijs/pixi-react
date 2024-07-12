import { Filter } from 'pixi.js';

import type { ContainerElement } from 'typedefs/ContainerElement.ts';
import type { Instance } from '../typedefs/Instance.ts';

export function detach(childInstance: Instance)
{
    if (childInstance instanceof Filter)
    {
        const parentInstance = childInstance.__pixireact.parent as Instance<ContainerElement>;

        if (parentInstance)
        {
            const filterIndex = parentInstance.__pixireact.filters.indexOf(childInstance);

            parentInstance.__pixireact.filters.splice(filterIndex, 1);
            parentInstance.filters = parentInstance.__pixireact.filters;
        }

        childInstance.__pixireact.parent = null;
    }
}
