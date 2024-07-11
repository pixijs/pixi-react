/** Clones an object without any of the ignored keys. */
export function gentleClone(
    object: Record<string, any>,
    ignoredKeys: string[] = [],
)
{
    const cloneBase: Record<string, any> = {};

    return Object.entries(object).reduce((accumulator, [key, value]) =>
    {
        if (!ignoredKeys.includes(key))
        {
            accumulator[key] = value;
        }

        return accumulator;
    }, cloneBase);
}
