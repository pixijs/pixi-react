import { useMemo } from 'react';
import { extendMotion } from './extendMotion';

/** Expose Pixi.js components for use in JSX. */
export function useExtendMotion(
    /** @description The Pixi.js components to be exposed. */
    objects: Parameters<typeof extendMotion>[0],
)
{
    useMemo(() =>
    {
        extendMotion(objects);
    }, [objects]);
}
