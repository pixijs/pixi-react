import { type HostConfig } from '../typedefs/HostConfig';
import { attach } from './attach';
import { log } from './log';
import { isContainer, isFilter } from './typeChecks';

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

    if (isContainer(childNode))
    {
        parentNode.addChild(childNode);
    }
    else if (isFilter(childNode))
    {
        attach(parentNode, childNode);
    }
}
