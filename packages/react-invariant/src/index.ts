// borrowed from fbjs
export function invariant(condition: boolean, format: string, ...args: string[])
{
    if (process.env.NODE_ENV === 'production')
    {
        return;
    }

    if (!condition)
    {
        let error;

        if (format === undefined)
        {
            error = new Error(
                'Minified exception occurred; use the non-minified dev environment '
                + 'for the full error message and additional helpful warnings.'
            );
        }
        else
        {
            let argIndex = 0;

            error = new Error(format.replace(/%s/g, () => String(args[argIndex++])));
            error.name = 'Invariant Violation';
        }

        // @ts-ignore: as per original fbjs implementation
        error.framesToPop = 1; // Skip invariant's own stack frame.
        throw error;
    }
}
