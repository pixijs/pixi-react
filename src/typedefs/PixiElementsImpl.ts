import { type NameOverrides } from '../constants/NameOverrides.js';

import type * as PIXI from 'pixi.js';
import type { AutoFilteredKeys } from './AutoFilteredKeys';
import type { Node } from './Node';

type PixiType = typeof PIXI;

export type PixiElementsImpl = {
    [K in AutoFilteredKeys as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]: Node<PixiType[K]>
};
