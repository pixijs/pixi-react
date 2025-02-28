import { Filter } from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';

export function detach(
    childInstance: HostConfig['instance'],
)
{
    if (childInstance instanceof Filter)
    {
        const parentInstance = childInstance.__pixireact.parent as HostConfig['instance'];

        if (parentInstance)
        {
            const filterIndex = parentInstance.__pixireact.filters.indexOf(childInstance);

            parentInstance.__pixireact.filters.splice(filterIndex, 1);
            parentInstance.filters = parentInstance.__pixireact.filters;
        }

        childInstance.__pixireact.parent = null;
    }
}
