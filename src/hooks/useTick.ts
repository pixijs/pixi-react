import { type TickerCallback } from 'pixi.js';
import { invariant } from '../helpers/invariant';
import { type UseTickOptions } from '../typedefs/UseTickOptions';
import { useApplication } from './useApplication';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/** Attaches a callback to the application's Ticker. */
export function useTick<T>(
    /** @description The function to be called on each tick. */
    options: TickerCallback<T> | UseTickOptions<T>,
)
{
    const {
        app,
        isInitialised,
    } = useApplication();

    let callback;

    let context: any;

    let isEnabled: boolean;

    let priority: number | undefined;

    if (typeof options === 'function')
    {
        callback = options;
    }
    else
    {
        callback = options.callback;
        context = options.context;
        isEnabled = options.isEnabled ?? true;
        priority = options.priority;
    }

    invariant(typeof callback === 'function', '`useTick` needs a callback function.');

    // eslint-disable-next-line consistent-return
    useIsomorphicLayoutEffect(() =>
    {
        if (isInitialised)
        {
            const ticker = app?.ticker;
            const wasEnabled = isEnabled;
            const previousContext = context;
            const previousCallback = callback;

            if (isEnabled && ticker)
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
        isInitialised,
        priority,
    ]);
}
