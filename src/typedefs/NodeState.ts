import type { Filter } from 'pixi.js';
import type { HostConfig } from './HostConfig.ts';

export interface NodeState
{
    autoRemovedBeforeAppend?: boolean;
    filters: Filter[],
    parent: null | HostConfig['containerInstance'];
    root: HostConfig['containerInstance'];
    type: string;
}
