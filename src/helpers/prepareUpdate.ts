import { diffProps } from './diffProps.ts';
import { log } from './log.ts';

import type { Instance } from '../typedefs/Instance.ts';
import type { InstanceProps } from '../typedefs/InstanceProps.ts';

export function prepareUpdate(
    _instance: Instance,
    _type: string,
    oldProps: InstanceProps,
    newProps: InstanceProps,
)
{
    log('info', 'lifecycle::prepareUpdate');

    // This is a data object, let's extract critical information about it
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        children: newChildren,
        ...newPropsRest
    } = newProps;
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        children: oldChildren,
        ...oldPropsRest
    } = oldProps;

    // Create a diff-set, flag if there are any changes
    const diff = diffProps(newPropsRest, oldPropsRest, true);

    if (diff.changes.length)
    {
        return [false, diff];
    }

    // Otherwise do not touch the instance
    return null;
}
