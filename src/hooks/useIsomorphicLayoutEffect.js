import {
    useEffect,
    useLayoutEffect,
} from 'react';

export const useIsomorphicLayoutEffect
  = typeof window !== 'undefined' && (window.document?.createElement || window.navigator?.product === 'ReactNative')
      ? useLayoutEffect
      : useEffect;
