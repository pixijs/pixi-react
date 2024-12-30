import {
    Container,
    Filter,
} from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';

export function unhideInstance(
    instance: HostConfig['instance'],
)
{
    if (instance instanceof Container)
    {
        instance.visible = true;
    }
    else if (instance instanceof Filter)
    {
        instance.enabled = true;
    }
}
