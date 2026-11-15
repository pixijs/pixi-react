import {
    Container,
    Filter,
} from 'pixi.js';
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

    if (childInstance instanceof Container)
    {
        // React removes only the top host node of a deleted subtree. Destroy each
        // descendant with default options so Graphics retains context ownership.
        for (const child of [...childInstance.children])
        {
            removeChild(
                childInstance as HostConfig['containerInstance'],
                child as HostConfig['instance'],
            );
        }
    }

    childInstance.destroy();
}
