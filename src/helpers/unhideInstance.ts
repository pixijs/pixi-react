import { Filter } from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';

export function unhideInstance(
    instance: HostConfig['instance'],
)
{
    if (instance instanceof Filter)
    {
        instance.enabled = true;
    }
    else if (typeof (instance as { visible?: unknown }).visible === 'boolean')
    {
        instance.visible = true;
    }
}
