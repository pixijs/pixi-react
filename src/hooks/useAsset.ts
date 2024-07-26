import {
    Assets,
    Cache,
} from 'pixi.js';
import { getAssetKey } from '../helpers/getAssetKey.ts';

import type {
    ProgressCallback,
    UnresolvedAsset,
} from 'pixi.js';
import type { AssetRetryOptions } from '../typedefs/AssetRetryOptions.ts';
import type { AssetRetryState } from '../typedefs/AssetRetryState.ts';
import type { ErrorCallback } from '../typedefs/ErrorCallback.ts';

const errorCache: Map<UnresolvedAsset | string, AssetRetryState> = new Map();

/**
 * Loads assets, returning a hash of assets once they're loaded.
 * @deprecated Use `useAssets` instead.
 */
export function useAsset<T>(
    /** @description Asset options. */
    options: (UnresolvedAsset<T> & AssetRetryOptions) | string,
    /** @description A function to be called when the asset loader reports loading progress. */
    onProgress?: ProgressCallback,
    /** @description A function to be called when the asset loader reports loading progress. */
    onError?: ErrorCallback,
)
{
    if (typeof window === 'undefined')
    {
        /**
         * This is a weird hack that allows us to throw the error during
         * serverside rendering, but still causes it to be handled appropriately
         * in Next.js applications.
         *
         * @see https://github.com/vercel/next.js/blob/38b3423160afc572ad933c24c86fc572c584e70b/packages/next/src/shared/lib/lazy-dynamic/bailout-to-csr.ts
         */
        throw Object.assign(Error('`useAsset` will only run on the client.'), {
            digest: 'BAILOUT_TO_CLIENT_SIDE_RENDERING',
        });
    }

    const {
        maxRetries = 3,
        retryOnFailure = true,
    } = typeof options !== 'string' ? options : {};

    const assetKey = getAssetKey(options);

    if (!Cache.has(assetKey))
    {
        let state = errorCache.get(options);

        // Rethrow the cached error if we are not retrying on failure or have reached the max retries
        if (state && (!retryOnFailure || state.retries > maxRetries))
        {
            if (typeof onError === 'function')
            {
                onError?.(state.error);
            }
            else
            {
                throw state.error;
            }
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
