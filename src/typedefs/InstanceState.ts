import type { Instance } from './Instance.ts';

export interface InstanceState
{
    autoRemovedBeforeAppend?: boolean;
    parent: null | Instance;
    root: Instance;
    type: string;
}
