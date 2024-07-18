import {
    Assets,
    Cache,
} from 'pixi.js';
import { getAssetKeyFromOptions } from '../helpers/getAssetKeyFromOptions.ts';

import type {
    ProgressCallback,
    UnresolvedAsset,
} from 'pixi.js';
import type { AssetRetryOptions } from '../typedefs/AssetRetryOptions.ts';
import type { AssetRetryState } from '../typedefs/AssetRetryState.ts';

const errorCache: Map<UnresolvedAsset | string, AssetRetryState> = new Map();

/** Loads assets, returning a hash of assets once they're loaded. */
export function useAsset<T>(
    /** @description Asset options. */
    options: (UnresolvedAsset<T> & AssetRetryOptions) | string,
    /** @description A function to be called when the asset loader reports loading progress. */
    onProgress?: ProgressCallback,
)
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
            .load<T>(options, onProgress)
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

    return Assets.get<T>(assetKey);
}
