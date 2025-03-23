import { useCallback, useRef } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: generics
export function useLatestFunction<T extends(...args: any) => any>(thing: T)
{
    const latestFunctionRef = useRef(thing);

    latestFunctionRef.current = thing;

    return useCallback(
        (...args: Parameters<T>) => latestFunctionRef.current(...args),
        [],
    ) as T;
}
