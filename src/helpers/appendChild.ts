import { type HostConfig } from '../typedefs/HostConfig';
import { appendHostChild } from './hostChildren';
import { log } from './log';

/** Adds elements to our application. */
export function appendChild(
    parentNode: HostConfig['containerInstance'],
    childNode: HostConfig['instance'] | null,
)
{
    log('info', 'lifecycle::appendChild');

    if (!childNode)
    {
        return;
    }

    appendHostChild(parentNode, childNode);
}
