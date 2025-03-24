import { useCallback, useRef } from 'react';

export function useLatestFunction<T extends(...args: any) => any>(thing: T)
{
    const latestFunctionRef = useRef(thing);

    latestFunctionRef.current = thing;

    return useCallback(
        (...args: Parameters<T>) => latestFunctionRef.current(...args),
        [],
    ) as T;
}
