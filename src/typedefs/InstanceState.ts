import type { Filter } from 'pixi.js';
import type { ContainerElement } from './ContainerElement.ts';
import type { Instance } from './Instance.ts';

export interface InstanceState
{
    autoRemovedBeforeAppend?: boolean;
    filters: Filter[],
    parent: null | Instance<ContainerElement>;
    root: Instance;
    type: string;
}
