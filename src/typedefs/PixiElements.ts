import type * as PIXI from 'pixi.js';
import type { NameOverrides } from '../constants/NameOverrides.ts';
import type { PixiComponents } from './PixiComponents.ts';
import type { PixiReactNode } from './PixiReactNode.ts';

export type PixiElements = {
    [K in PixiComponents as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]: PixiReactNode<typeof PIXI[K]>
};
