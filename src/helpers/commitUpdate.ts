import { applyProps } from '../helpers/applyProps.ts';
import { log } from '../helpers/log.ts';
import { switchInstance } from './switchInstance.ts';

import type { Fiber } from 'react-reconciler';
import type { DiffSet } from '../typedefs/DiffSet.ts';
import type { HostConfig } from '../typedefs/HostConfig.ts';
import type { Instance } from '../typedefs/Instance.ts';
import type { InstanceProps } from '../typedefs/InstanceProps.ts';

export function commitUpdate(
    instance: Instance,
    updatePayload: [boolean, DiffSet],
    type: HostConfig['type'],
    _oldProps: InstanceProps,
    newProps: InstanceProps,
    fiber: Fiber,
)
{
    log('info', 'lifecycle::commitUpdate');

    const [reconstruct, diff] = updatePayload;

    if (reconstruct)
    {
        switchInstance(instance, type, newProps, fiber);
    }
    else
    {
        applyProps(instance, diff);
    }
}
