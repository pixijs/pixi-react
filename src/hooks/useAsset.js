import {
    Assets,
    Cache,
} from 'pixi.js';
import { getAssetKeyFromOptions } from '../helpers/getAssetKeyFromOptions.js';

/** @typedef {import('pixi.js').ProgressCallback} ProgressCallback */
/**
 * @template T
 * @typedef {import('pixi.js').UnresolvedAsset<T>} UnresolvedAsset
 */

/**
 * Loads assets, returning a hash of assets once they're loaded.
 *
 * @template T
 * @param {UnresolvedAsset<T> | string} options Asset options.
 * @param {ProgressCallback} [onProgress] A function to be called when the asset loader reports loading progress.
 * @returns {T}
 */
export function useAsset(options, onProgress)
{
    const assetKey = getAssetKeyFromOptions(options);

    if (!Cache.has(assetKey))
    {
        throw Assets.load(options, onProgress);
    }

    return Assets.get(assetKey);
}
