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
 * Attaches a callback to the application's Ticker.
 *
 * @template T
 * @param {TickerCallback<T> | TickCallbackOptions<T>} options The function to be called on each tick.
 * @param {boolean} [enabled] Whether this callback is currently enabled.
 */
function useTick(options, enabled = true)
{
    const app = useApp();

    /** @type {Function} */
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

    /** @type {MutableRefObject<Function>} */
    const callbackRef = useRef(callback);

    useEffect(() =>
    {
        callbackRef.current = callback;
    }, [callback]);

    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        if (enabled)
        {
            /** @type {TickerCallback<*>} */
            const tick = (ticker) => callbackRef.current.apply(ticker);

            app.ticker.add(tick, context, priority);

            return () =>
            {
                if (app.ticker)
                {
                    app.ticker.remove(tick, context);
                }
            };
        }
    }, [enabled]);
}

export { useTick };
