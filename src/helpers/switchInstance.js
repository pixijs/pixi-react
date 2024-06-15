import { appendChild } from './appendChild.js';
import { createInstance } from './createInstance.js';
import { removeChild } from './removeChild.js';

/** @typedef {import('../typedefs/HostConfig.js').HostConfig} HostConfig */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */

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
    const parent = instance.__pixireact?.parent;

    if (!parent)
    {
        return;
    }

    /** @type {Instance} */
    const root = /** @type {*} */ (instance.__pixireact?.root);
    const newInstance = createInstance(type, newProps, root);

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
