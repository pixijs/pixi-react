import type { DiffSet } from './DiffSet.ts';

export interface UpdatePayload
{
    diff?: DiffSet,
    shouldReconstruct: boolean,
}
