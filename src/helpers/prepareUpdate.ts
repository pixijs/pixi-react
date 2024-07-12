import { diffProps } from './diffProps.ts';
import { log } from './log.ts';

import type { Instance } from '../typedefs/Instance.ts';
import type { InstanceProps } from '../typedefs/InstanceProps.ts';
import type { UpdatePayload } from '../typedefs/UpdatePayload.ts';

export function prepareUpdate(
    _instance: Instance,
    _type: string,
    oldProps: InstanceProps,
    newProps: InstanceProps,
)
{
    log('info', 'lifecycle::prepareUpdate');

    const updatePayload: UpdatePayload = {
        shouldReconstruct: false,
    };

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

    const diff = diffProps(newPropsRest, oldPropsRest, true);

    if (diff.changes.length)
    {
        updatePayload.diff = diff;
    }

    return updatePayload;
}
