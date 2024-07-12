import {
    Container,
    Filter,
} from 'pixi.js';

import type { ContainerElement } from '../typedefs/ContainerElement.ts';
import type { FilterElement } from '../typedefs/FilterElement.ts';
import type { Instance } from '../typedefs/Instance.ts';

export function unhideInstance(instance: Instance)
{
    if (Container && instance instanceof Container)
    {
        (instance as ContainerElement).visible = true;
    }
    else if (Filter && instance instanceof Filter)
    {
        (instance as FilterElement).enabled = true;
    }
}
