import { Filter } from 'pixi.js';
import { detach } from './detach.ts';
import { log } from './log.ts';

import type { Instance } from '../typedefs/Instance.ts';

/** Removes elements from our scene and disposes of them. */
export function removeChild(_parentInstance: Instance, childInstance: Instance)
{
    log('info', 'lifecycle::removeChild');

    if (childInstance instanceof Filter)
    {
        detach(childInstance);
    }

    childInstance.destroy();
}
