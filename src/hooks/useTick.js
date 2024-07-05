import { useEffect } from 'react';
import { invariant } from '../helpers/invariant.js';
import { useApp } from './useApp.js';

/**
 * @template T
 * @typedef {import('pixi.js').TickerCallback<T>} TickerCallback
 */
/**
 * @template T
 * @typedef {import('../typedefs/TickCallbackOptions.ts').TickCallbackOptions<T>} TickCallbackOptions
 */

/**
 * Attaches a callback to the application's Ticker.
 *
 * @template T
 * @param {TickerCallback<T> | TickCallbackOptions<T>} options The function to be called on each tick.
 * @param {boolean} [enabled] Whether this callback is currently enabled.
 */
function useTick(options, enabled = true)
{
    const app = useApp();

    let callback;

    /** @type {*} */
    let context;

    /** @type {number | undefined} */
    let priority;

    if (typeof options === 'function')
    {
        callback = options;
    }
    else
    {
        callback = options.callback;
        context = options.context;
        priority = options.priority;
    }

    invariant(typeof callback === 'function', '`useTick` needs a callback function.');

    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        const ticker = app?.ticker;

        if (ticker)
        {
            const wasEnabled = enabled;
            const previousContext = context;
            const previousCallback = callback;

            if (enabled && ticker)
            {
                ticker.add(callback, context, priority);
            }

            return () =>
            {
                wasEnabled && ticker?.remove(previousCallback, previousContext);
            };
        }
    }, [
        callback,
        context,
        enabled,
        priority,
    ]);
}

export { useTick };
