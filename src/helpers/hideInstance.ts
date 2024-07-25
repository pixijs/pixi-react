import {
    Container,
    Filter,
} from 'pixi.js';

import type { HostConfig } from '../typedefs/HostConfig.ts';

export function hideInstance(
    instance: HostConfig['instance']
)
{
    if (instance instanceof Container)
    {
        (instance as HostConfig['containerInstance']).visible = false;
    }
    else if (instance instanceof Filter)
    {
        (instance as HostConfig['filterInstance']).enabled = false;
    }
}
