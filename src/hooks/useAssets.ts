import {
    Assets,
    Cache,
} from 'pixi.js';
import { getAssetKey } from '../helpers/getAssetKey.ts';

import type { AssetRetryState } from '../typedefs/AssetRetryState.ts';
import type { UnresolvedAsset } from '../typedefs/UnresolvedAsset.ts';
import type { UseAssetsOptions } from '../typedefs/UseAssetsOptions.ts';

const errorCache: Map<UnresolvedAsset, AssetRetryState> = new Map();

/** Loads assets, returning a hash of assets once they're loaded. */
export function useAssets<T>(
    /** @description Assets to be loaded. */
    assets: UnresolvedAsset<T>[],
    /** @description Asset options. */
    options: UseAssetsOptions = {},
): T[]
{
    if (typeof window === 'undefined')
    {
        throw Object.assign(Error('`useAsset` will only run on the client.'), {
            digest: 'BAILOUT_TO_CLIENT_SIDE_RENDERING',
        });
    }

    const {
        maxRetries = 3,
        onError,
        onProgress,
        retryOnFailure = true,
    } = options;

    const allAssetsAreLoaded = assets.some((asset: UnresolvedAsset<T>) => Cache.has(getAssetKey(asset)));

    if (!allAssetsAreLoaded)
    {
        let state = errorCache.get(assets);

        // Rethrow the cached error if we are not retrying on failure or have reached the max retries
        if (state && (!retryOnFailure || state.retries > maxRetries))
        {
            if (typeof onError === 'function')
            {
                onError(state.error);
            }
            else
            {
                throw state.error;
            }
        }

        throw Assets
            .load<T>(assets, (progressValue) =>
        {
            if (typeof onProgress === 'function')
            {
                onProgress(progressValue);
            }
        })
            .catch((error) =>
            {
                if (!state)
                {
                    state = {
                        error,
                        retries: 0,
                    };
                }

                errorCache.set(assets, {
                    ...state,
                    error,
                    retries: state.retries + 1,
                });
            });
    }

    const assetKeys = assets.map((asset: UnresolvedAsset<T>) => getAssetKey(asset));
    const resolvedAssetsDictionary = Assets.get<T>(assetKeys) as Record<string, T>;

    return assets.map((_asset: UnresolvedAsset<T>, index: number) => resolvedAssetsDictionary[index]);
}
