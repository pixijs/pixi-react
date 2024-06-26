import {
    useEffect,
    useRef,
} from 'react';
import { invariant } from '../helpers/invariant.js';
import { useApp } from './useApp.js';

/** @typedef {number} UPDATE_PRIORITY */
/**
 * @template T
 * @typedef {import('pixi.js').TickerCallback<T>} TickerCallback
 */
/**
 * @template T
 * @typedef {import('react').MutableRefObject<T>} MutableRefObject
 */

/**
 * @template T
 * @typedef {object} TickCallbackOptions
 * @property {TickerCallback<T>} callback The function to be called on each tick.
 * @property {T} [context] The value of `this` within the callback.
 * @property {UPDATE_PRIORITY} [priority] The priority of this callback compared to other callbacks on the ticker.
 */

/**
 * @template T
 * @typedef {object} TickState
 * @property {TickerCallback<T>} callback
 * @property {*} context
 * @property {number | undefined} priority
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

    /** @type {MutableRefObject<TickState<T>>} */
    const stateRef = useRef({
        callback,
        context,
        priority,
    });

    useEffect(() =>
    {
        if (app.ticker)
        {
            app.ticker.remove(stateRef.current.callback, stateRef.current.context);
        }
        stateRef.current.callback = callback;
        stateRef.current.context = context;
        stateRef.current.priority = priority;
    }, [
        callback,
        context,
        priority,
    ]);

    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        if (enabled)
        {
            const {
                callback: currentCallback,
                context: currentContext,
                priority: currentPriority,
            } = stateRef.current;

            app.ticker.add(currentCallback, currentContext, currentPriority);

            return () =>
            {
                if (app.ticker)
                {
                    app.ticker.remove(currentCallback, currentContext);
                }
            };
        }
    }, [enabled]);
}

export { useTick };
