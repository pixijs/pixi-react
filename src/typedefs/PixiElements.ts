import type * as PIXI from 'pixi.js';
import type { NameOverrides } from '../constants/NameOverrides.js';
import type { AutoFilteredKeys } from './AutoFilteredKeys.ts';
import type { PixiReactNode } from './PixiReactNode.ts';

export type PixiElements = {
    [K in AutoFilteredKeys as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]: PixiReactNode<typeof PIXI[K]>
};
