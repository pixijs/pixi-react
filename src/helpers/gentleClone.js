/**
 * Clones an object without any of the ignored keys.
 *
 * @param {Record<string, any>} object The object to clone.
 * @param {string[]} [ignoredKeys] An array of keys to ignore when cloning the object.
 * @returns {Record<string, any>} The cloned object.
 */
export function gentleClone(object, ignoredKeys = [])
{
    /** @type {Record<string, any>} */
    const cloneBase = {};

    return Object.entries(object).reduce((accumulator, [key, value]) =>
    {
        if (!ignoredKeys.includes(key))
        {
            accumulator[key] = value;
        }

        return accumulator;
    }, cloneBase);
}
