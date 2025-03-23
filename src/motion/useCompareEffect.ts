import { useEffect } from 'react';

import type { ObservablePoint, PointData } from 'pixi.js';

export const useCompareEffect = (
    callback: VoidFunction,
    [set, point]: [unknown, number | ObservablePoint | PointData | undefined],
) =>

    // biome-ignore lint/correctness/useExhaustiveDependencies: precise comparison
    useEffect(callback, [
        set,
        typeof point === 'object' ? point.x : null,
        typeof point === 'object' ? point.y : null,
        typeof point !== 'object' ? point : null,
    ])
;
