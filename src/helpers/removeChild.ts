import { Filter } from 'pixi.js';
import { detach } from './detach.ts';
import { log } from './log.ts';

import type { HostConfig } from '../typedefs/HostConfig.ts';

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
