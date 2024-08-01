import { Filter } from 'pixi.js';
import { detach } from './detach';
import { log } from './log';

import type { HostConfig } from '../typedefs/HostConfig';

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
