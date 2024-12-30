import { type DiffSet } from '../typedefs/DiffSet';

/** Whether the input is a diff set. */
export function isDiffSet(input: any): input is DiffSet
{
    const inputAsDiffSet = input as DiffSet;

    if (!inputAsDiffSet)
    {
        return false;
    }

    if (!inputAsDiffSet.changes)
    {
        return false;
    }

    return true;
}
