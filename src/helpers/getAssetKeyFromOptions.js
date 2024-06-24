/**
 * @template T
 * @typedef {import('pixi.js').UnresolvedAsset<T>} UnresolvedAsset
 */

/**
 * Loads assets, returning a hash of assets once they're loaded.
 *
 * @template T
 * @param {UnresolvedAsset<T> | string} options The asset's options.
 * @returns {string}
 */
export function getAssetKeyFromOptions(options)
{
    let assetKey;

    if (typeof options === 'string')
    {
        assetKey = options;
    }
    else
    {
        assetKey = /** @type {string} */ (options.alias ?? options.src);
    }

    return assetKey;
}
