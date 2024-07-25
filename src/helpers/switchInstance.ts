import { appendChild } from './appendChild.ts';
import { createInstance } from './createInstance.ts';
import { removeChild } from './removeChild.ts';

import type { Fiber } from 'react-reconciler';
import type { HostConfig } from '../typedefs/HostConfig.ts';

export function switchInstance(
    instance: HostConfig['instance'],
    type: HostConfig['type'],
    newProps: HostConfig['props'],
    fiber: Fiber,
)
{
    const parent = instance.__pixireact?.parent;

    if (!parent)
    {
        return;
    }

    const root = instance.__pixireact.root as HostConfig['instance'];
    const newInstance = createInstance(type, newProps, root);

    if (!instance.__pixireact.autoRemovedBeforeAppend)
    {
        removeChild(parent, instance);
    }

    if (newInstance.parent)
    {
        newInstance.__pixireact.autoRemovedBeforeAppend = true;
    }

    appendChild(parent as HostConfig['containerInstance'], newInstance);

    // This evil hack switches the react-internal fiber node
    // https://github.com/facebook/react/issues/14983
    // https://github.com/facebook/react/pull/15021
    const fibers = [fiber, fiber.alternate];

    fibers.forEach((fiber) =>
    {
        if (fiber !== null)
        {
            fiber.stateNode = newInstance;

            if (fiber.ref)
            {
                if (typeof fiber.ref === 'function')
                {
                    fiber.ref(newInstance);
                }
                else
                {
                    const ref = fiber.ref;

                    ref.current = newInstance;
                }
            }
        }
    });
}
