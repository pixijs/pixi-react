import { Filter } from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';
import { detach } from './detach';
import { log } from './log';

/** Removes elements from our scene and disposes of them. */
export function removeChild(
    _parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
)
{
    log('info', 'lifecycle::removeChild');

    if (childInstance instanceof Filter)
    {
        detach(childInstance);
    }

    childInstance.destroy();
}
