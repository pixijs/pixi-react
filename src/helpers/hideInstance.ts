import { catalogue } from './catalogue.ts';

import type { ContainerElement } from '../typedefs/ContainerElement.ts';
import type { FilterElement } from '../typedefs/FilterElement.ts';
import type { Instance } from '../typedefs/Instance.ts';

export function hideInstance(instance: Instance)
{
    const {
        Container,
        Filter,
    } = catalogue;

    if (Container && instance instanceof Container)
    {
        (instance as ContainerElement).visible = false;
    }
    else if (Filter && instance instanceof Filter)
    {
        (instance as FilterElement).enabled = false;
    }
}
