import type * as PIXI from 'pixi.js';
import type { NameOverrides } from '../constants/NameOverrides';
import type { PixiComponents } from './PixiComponents';
import type { PixiReactElementProps } from './PixiReactNode';

export type PixiElements = {
    [K in PixiComponents as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]: {
        [K2 in keyof PixiReactElementProps<typeof PIXI[K]> as K2]?: PixiReactElementProps<typeof PIXI[K]>[K2] extends (...args: any) => any
            ? never
            : PixiReactElementProps<typeof PIXI[K]>[K2];
    };
};
