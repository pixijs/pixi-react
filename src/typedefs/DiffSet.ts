import type { Change } from './Change.ts';

export interface DiffSet
{
    changes: Change[],
}
