import type { DiffSet } from './DiffSet';

export interface UpdatePayload
{
    diff?: DiffSet,
    shouldReconstruct: boolean,
}
