import type * as PIXI from 'pixi.js';
import type { NameOverrides } from '../constants/NameOverrides.ts';
import type { PixiComponents } from './PixiComponents.ts';
import type { PixiReactElementProps } from './PixiReactNode.ts';

export type PixiElements = {
    [K in PixiComponents as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]: {
        [K2 in keyof PixiReactElementProps<typeof PIXI[K]> as K2]?: PixiReactElementProps<typeof PIXI[K]>[K2] extends (...args: any) => any
            ? never
            : PixiReactElementProps<typeof PIXI[K]>[K2];
    };
};
