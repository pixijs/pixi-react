import { useMemo } from 'react';
import { extend } from '../helpers/extend';

/** Expose Pixi.js components for use in JSX. */
export function useExtend(
    /** @description The Pixi.js components to be exposed. */
    objects: Parameters<typeof extend>[0],
)
{
    useMemo(() =>
    {
        extend(objects);
    }, [objects]);
}
