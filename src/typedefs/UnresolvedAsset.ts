import type { UnresolvedAsset as PixiUnresolvedAsset } from 'pixi.js';

export type UnresolvedAsset<T = any> = PixiUnresolvedAsset<T> | string;
