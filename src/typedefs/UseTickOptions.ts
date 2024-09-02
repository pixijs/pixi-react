import type { TickerCallback } from 'pixi.js';

export interface UseTickOptions<T>
{
    /** @description The function to be called on each tick. */
    callback: TickerCallback<T>

    /** @description The value of `this` within the callback. */
    context?: T

    /** @description Whether this callback is currently enabled. */
    isEnabled?: true,

    /** @description The priority of this callback compared to other callbacks on the ticker. */
    priority?: number
}
