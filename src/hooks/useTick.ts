import { useEffect } from 'react';
import { invariant } from '../helpers/invariant.ts';
import { useApp } from './useApp.ts';

import type { TickerCallback } from 'pixi.js';
import type { TickCallbackOptions } from '../typedefs/TickCallbackOptions.ts';

/** Attaches a callback to the application's Ticker. */
function useTick<T>(
    /** @description The function to be called on each tick. */
    options: TickerCallback<T> | TickCallbackOptions<T>,
    /** @description Whether this callback is currently enabled. */
    enabled = true,
)
{
    const app = useApp();

    let callback;

    let context: any;

    let priority: number | undefined;

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
                if (wasEnabled)
                {
                    ticker?.remove(previousCallback, previousContext);
                }
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
