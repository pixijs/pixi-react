import { type HostConfig } from '../typedefs/HostConfig';
import { isFilter } from './typeChecks';

export function attach(
    parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
    targetIndex?: number
)
{
    if (isFilter(childInstance))
    {
        (childInstance as unknown as HostConfig['filterInstance']).__pixireact.parent = parentInstance;

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
