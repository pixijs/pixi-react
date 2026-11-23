import { Filter } from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';

export function hideInstance(
    instance: HostConfig['instance']
)
{
    if (instance instanceof Filter)
    {
        instance.enabled = false;
    }
    else if (typeof (instance as { visible?: unknown }).visible === 'boolean')
    {
        instance.visible = false;
    }
}
