import { applyProps } from '../helpers/applyProps.ts';
import { log } from '../helpers/log.ts';
import { switchInstance } from './switchInstance.ts';

import type { Fiber } from 'react-reconciler';
import type { HostConfig } from '../typedefs/HostConfig.ts';
import type { Instance } from '../typedefs/Instance.ts';
import type { InstanceProps } from '../typedefs/InstanceProps.ts';
import type { UpdatePayload } from '../typedefs/UpdatePayload.ts';

export function commitUpdate(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: HostConfig['type'],
    _oldProps: InstanceProps,
    newProps: InstanceProps,
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
