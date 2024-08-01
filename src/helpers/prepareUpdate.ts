import { diffProps } from './diffProps';
import { log } from './log';

import type { HostConfig } from '../typedefs/HostConfig';
import type { UpdatePayload } from '../typedefs/UpdatePayload';

export function prepareUpdate(
    _instance: HostConfig['instance'],
    _type: HostConfig['type'],
    oldProps: HostConfig['props'],
    newProps: HostConfig['props'],
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
