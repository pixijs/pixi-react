import { useMemo } from 'react';
import { extend } from '../helpers/extend.js';

/**
 * Expose Pixi.js components for use in JSX.
 *
 * @param {Parameters<typeof extend>[0]} objects The Pixi.js components to be exposed.
 */
export function useExtend(objects)
{
    useMemo(() =>
    {
        extend(objects);
    }, [objects]);
}
