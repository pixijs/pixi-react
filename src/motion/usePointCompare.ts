import { useEffect, useMemo } from 'react';

import type { ObservablePoint, PointData } from 'pixi.js';

type NumberPoint = number | ObservablePoint | PointData | undefined;

const toDependencyArray = (point: NumberPoint) => [
    typeof point === 'object' ? point.x : null,
    typeof point === 'object' ? point.y : null,
    typeof point !== 'object' ? point : null,
];

export const usePointCompareEffect = (
    callback: VoidFunction,
    point: NumberPoint
) =>
    useEffect(callback, toDependencyArray(point));

export const usePointCompareMemo = <MemoType>(
    memo: () => MemoType,
    point: NumberPoint
) =>
    useMemo(memo, toDependencyArray(point));
