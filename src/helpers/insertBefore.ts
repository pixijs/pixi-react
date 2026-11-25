import { type HostConfig } from '../typedefs/HostConfig';
import { insertHostChild } from './hostChildren';
import { invariant } from './invariant';
import { log } from './log';

export function insertBefore(
    parentInstance: HostConfig['containerInstance'],
    childInstance: HostConfig['instance'],
    beforeChildInstance: HostConfig['instance'],
)
{
    log('info', 'lifecycle::insertBefore');

    invariant(childInstance !== beforeChildInstance, 'Cannot insert node before itself');

    insertHostChild(parentInstance, childInstance, beforeChildInstance);
}
