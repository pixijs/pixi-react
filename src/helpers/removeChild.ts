import { type HostConfig } from '../typedefs/HostConfig';
import { removeHostChild } from './hostChildren';
import { log } from './log';

/** Removes elements from our scene and disposes of them. */
export function removeChild(
    parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
)
{
    log('info', 'lifecycle::removeChild');

    removeHostChild(parentInstance, childInstance);

    childInstance.destroy();
}
