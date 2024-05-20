// Module imports
import { Graphics } from 'pixi.js';
import { type Props } from '../reconciler.js';
// Local imports
import { pruneKeys } from './pruneKeys.js';

import type { Container } from 'pixi.js';

/**
 * Apply properties to Pixi.js instance.
 *
 * @param {object} instance An instance?
 * @param {object} newProps New props.
 * @param {object} oldProps Old props.
 */
export function applyProps(instance: Container, newProps: Props, oldProps: Props)
{
    // Filter identical props, event handlers, and reserved keys
    const identicalProps = Object
        .keys(newProps)
        .filter((key) => newProps[key] === oldProps[key]);

    if ((instance instanceof Graphics) && !identicalProps.includes('draw'))
    {
        newProps.draw?.(instance);
    }

    const handlers = Object.keys(newProps).filter((key) =>
    {
        const isFunction = typeof newProps[key] === 'function';

        return isFunction && key.startsWith('on');
    });

    const props = pruneKeys(newProps, [
        ...identicalProps,
        ...handlers,
        'children',
        'draw',
        'key',
        'ref',
    ]);

    // Mutate our Pixi.js element
    if (Object.keys(props).length)
    {
        Object.entries(props).forEach(([key, value]) =>
        {
            (instance as any)[key] = value;
        });
    }

    // Collect event handlers.
    // We put this on an invalid prop so Pixi.js doesn't serialize handlers
    // if you do ref.current.clone() or ref.current.toJSON()
    if (handlers.length)
    {
        instance.__handlers = handlers.reduce(
            (acc, key) => ({
                ...acc,
                [key]: newProps[key],
            }),
            {},
        );
    }
}
