/**
 * @param {boolean} condition The condition that will trigger the violation.
 * @param {string} format Formatting string.
 * @param  {...string} args Additional arguments to use within the string.
 * @throws {Error} Throws an error is `condition` evaluates to false.
 */
export function invariant(condition, format, ...args)
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
            error = new Error('Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.');
        }
        else
        {
            let argIndex = 0;

            error = new Error(format.replace(/%s/g, () => String(args[argIndex++])));
            error.name = 'Invariant Violation';
        }

        throw error;
    }
}
