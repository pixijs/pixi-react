import { Application, Ticker } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { useApp } from './useApp';
import invariant from '../utils/invariant';

const ticker = new Ticker();

function useTick(callback, enabled = true)
{
    invariant(typeof callback === 'function', '`useTick` needs a callback function.');

    const savedRef = useRef(null);

    useEffect(() =>
    {
        savedRef.current = callback;
    }, [callback]);

    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        if (enabled)
        {
            const tick = (delta) => savedRef.current.apply(ticker, [delta, ticker]);

            ticker.add(tick);

            return () =>
            {
                if (ticker)
                {
                    ticker.remove(tick);
                }
            };
        }
    }, [enabled]);
}

export { useTick };
