import { appendChild } from './appendChild.js';
import { createInstance } from './createInstance.js';
import { removeChild } from './removeChild.js';

/** @typedef {import('../typedefs/HostConfig.js').HostConfig} HostConfig */

/**
 * @param {HostConfig['instance']} instance
 * @param {HostConfig['type']} type
 * @param {HostConfig['props']} newProps
 * @param {import('react-reconciler').Fiber} fiber
 * @returns
 */
export function switchInstance(
    instance,
    type,
    newProps,
    fiber,
)
{
    const parent = instance.parent;

    if (!parent)
    {
        return;
    }

    const newInstance = createInstance(type, newProps, instance.root);

    if (!instance.autoRemovedBeforeAppend)
    {
        removeChild(parent, instance);
    }

    if (newInstance.parent)
    {
        newInstance.autoRemovedBeforeAppend = true;
    }

    appendChild(parent, newInstance);

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
                    /** @type {import('react-reconciler').RefObject} */
                    const ref = /** @type {*} */ (fiber.ref);

                    ref.current = newInstance;
                }
            }
        }
    });
}
