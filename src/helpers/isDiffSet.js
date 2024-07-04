/**
 * @param {*} input
 * @returns {boolean} Whether the input is a diff set.
 */
export function isDiffSet(input)
{
    const inputAsDiffSet = /** @type {import('../typedefs/DiffSet.ts').DiffSet} */ input;

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
