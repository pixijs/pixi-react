import { type HostConfig } from '../typedefs/HostConfig';
import { detach } from './detach';
import { log } from './log';
import { isFilter } from './typeChecks';

/** Removes elements from our scene and disposes of them. */
export function removeChild(
    _parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
)
{
    log('info', 'lifecycle::removeChild');

    if (isFilter(childInstance))
    {
        detach(childInstance);
    }

    childInstance.destroy();
}
