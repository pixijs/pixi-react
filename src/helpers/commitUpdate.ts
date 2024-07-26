import { applyProps } from '../helpers/applyProps.ts';
import { log } from '../helpers/log.ts';
import { switchInstance } from './switchInstance.ts';

import type { Fiber } from 'react-reconciler';
import type { HostConfig } from '../typedefs/HostConfig.ts';
import type { UpdatePayload } from '../typedefs/UpdatePayload.ts';

export function commitUpdate(
    instance: HostConfig['instance'],
    updatePayload: UpdatePayload,
    type: HostConfig['type'],
    _oldProps: HostConfig['props'],
    newProps: HostConfig['props'],
    fiber: Fiber,
)
{
    log('info', 'lifecycle::commitUpdate');

    const {
        diff,
        shouldReconstruct,
    } = updatePayload;

    if (shouldReconstruct)
    {
        switchInstance(instance, type, newProps, fiber);
    }
    else if (diff)
    {
        applyProps(instance, diff);
    }
}
