import {
    Assets,
    Cache,
} from 'pixi.js';
import { getAssetKeyFromOptions } from '../helpers/getAssetKeyFromOptions.js';

/** @typedef {import('../typedefs/AssetRetryOptions.ts').AssetRetryOptions} AssetRetryOptions */
/** @typedef {import('../typedefs/AssetRetryState.ts').AssetRetryState} AssetRetryState */

/** @type {Map<import('pixi.js').UnresolvedAsset | string, AssetRetryState>} */
const errorCache = new Map();

/**
 * Loads assets, returning a hash of assets once they're loaded.
 *
 * @template T
 * @param {(import('pixi.js').UnresolvedAsset<T> & AssetRetryOptions) | string} options Asset options.
 * @param {import('pixi.js').ProgressCallback} [onProgress] A function to be called when the asset loader reports loading progress.
 * @returns {T}
 */
export function useAsset(options, onProgress)
{
    if (typeof window === 'undefined')
    {
        throw Object.assign(Error('`useAsset` will only run on the client.'), {
            digest: 'BAILOUT_TO_CLIENT_SIDE_RENDERING',
        });
    }

    const {
        maxRetries = 3,
        retryOnFailure = true,
    } = typeof options !== 'string' ? options : {};

    const assetKey = getAssetKeyFromOptions(options);

    if (!Cache.has(assetKey))
    {
        let state = errorCache.get(options);

        // Rethrow the cached error if we are not retrying on failure or have reached the max retries
        if (state && (!retryOnFailure || state.retries > maxRetries))
        {
            throw state.error;
        }

        throw Assets
            .load(options, onProgress)
            .catch((error) =>
            {
                if (!state)
                {
                    state = {
                        error,
                        retries: 0,
                    };
                }

                errorCache.set(options, {
                    ...state,
                    error,
                    retries: state.retries + 1,
                });
            });
    }

    return Assets.get(assetKey);
}
