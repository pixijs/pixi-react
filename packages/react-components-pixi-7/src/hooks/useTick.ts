import { invariant } from '@pixi/react-invariant';
import type { Ticker } from '@pixi/ticker';
import { useEffect, useRef } from 'react';
import { useApp } from './useApp';

type UseTickCallback = (delta: number, ticker: Ticker) => void;

function useTick(callback: UseTickCallback, enabled = true)
{
    const app = useApp();

    invariant(typeof callback === 'function', '`useTick` needs a callback function.');

    const savedRef = useRef<UseTickCallback | null>(null);

    useEffect(() =>
    {
        savedRef.current = callback;
    }, [callback]);

    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        if (enabled)
        {
            const tick = (delta: number) => savedRef.current?.apply(app.ticker, [delta, app.ticker]);

            app.ticker.add(tick);

            return () =>
            {
                // if app is destroyed then ticker may be killed before this happens
                app.ticker?.remove(tick);
            };
        }
    }, [enabled]);
}

export { useTick };
