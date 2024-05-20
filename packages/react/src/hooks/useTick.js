import { Application } from '@pixi/app';
import { useEffect, useRef } from 'react';
import { useApp } from './useApp';
import invariant from '../utils/invariant';

function useTick(callback, enabled = true)
{
    const app = useApp();

    invariant(typeof callback === 'function', '`useTick` needs a callback function.');
    invariant(
        app instanceof Application,
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

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
            const tick = (delta) => savedRef.current.apply(app.ticker, [delta, app.ticker]);

            app.ticker.add(tick);

            return () =>
            {
                if (app.ticker)
                {
                    app.ticker.remove(tick);
                }
            };
        }
    }, [enabled]);
}

export { useTick };
