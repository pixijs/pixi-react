import {
    Container,
    Filter,
} from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';

export function hideInstance(
    instance: HostConfig['instance']
)
{
    if (instance instanceof Container)
    {
        instance.visible = false;
    }
    else if (instance instanceof Filter)
    {
        instance.enabled = false;
    }
}
