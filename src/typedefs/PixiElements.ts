import type * as PIXI from 'pixi.js';
import type { NameOverrides } from '../constants/NameOverrides';
import type { PixiComponents } from './PixiComponents';
import type { PixiReactElementProps } from './PixiReactNode';

export type PixiElements = {
    [K in PixiComponents as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]: PixiReactElementProps<typeof PIXI[K]>;
};
