/**
 * Prunes keys from an object.
 *
 * @param {object} object The object to be pruned.
 * @param  {...any} keys The keys to prune.
 * @returns {object} The pruned object.
 */
export function pruneKeys(object, ...keys)
{
    const keysToRemove = new Set(keys.flat());
    const objectEntries = Object.entries(object);
    const filteredObjectEntries = objectEntries.filter(([key]) => !keysToRemove.has(key));

    return Object.fromEntries(filteredObjectEntries);
}
