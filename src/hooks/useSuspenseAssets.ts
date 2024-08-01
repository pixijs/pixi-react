import {
    Assets,
    Cache,
} from 'pixi.js';
import { getAssetKey } from '../helpers/getAssetKey';

import type { AssetRetryState } from '../typedefs/AssetRetryState';
import type { UnresolvedAsset } from '../typedefs/UnresolvedAsset';
import type { UseAssetsOptions } from '../typedefs/UseAssetsOptions';

const errorCache: Map<UnresolvedAsset, AssetRetryState> = new Map();

function assetsLoadedTest<T>(asset: UnresolvedAsset<T>)
{
    return Cache.has(getAssetKey(asset));
}

/** Loads assets, returning a hash of assets once they're loaded. Must be inside of a `<Suspense>` component. */
export function useSuspenseAssets<T = any>(
    /** @description Assets to be loaded. */
    assets: UnresolvedAsset<T>[],
    /** @description Asset options. */
    options: UseAssetsOptions = {},
): T[]
{
    if (typeof window === 'undefined')
    {
        throw Object.assign(Error('`useAssets` will only run on the client.'), {
            digest: 'BAILOUT_TO_CLIENT_SIDE_RENDERING',
        });
    }

    const {
        maxRetries = 3,
        onError,
        onProgress,
        retryOnFailure = true,
    } = options;

    const allAssetsAreLoaded = assets.some(assetsLoadedTest<T>);

    if (!allAssetsAreLoaded)
    {
        let cachedState = errorCache.get(assets);

        // Rethrow the cached error if we are not retrying on failure or have reached the max retries
        if (cachedState && (!retryOnFailure || cachedState.retries > maxRetries))
        {
            if (typeof onError === 'function')
            {
                onError(cachedState.error);
            }
            else
            {
                throw cachedState.error;
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
                if (!cachedState)
                {
                    cachedState = {
                        error,
                        retries: 0,
                    };
                }

                errorCache.set(assets, {
                    ...cachedState,
                    error,
                    retries: cachedState.retries + 1,
                });
            });
    }

    const assetKeys = assets.map((asset: UnresolvedAsset<T>) => getAssetKey(asset));
    const resolvedAssetsDictionary = Assets.get<T>(assetKeys) as Record<string, T>;

    return assets.map((_asset: UnresolvedAsset<T>, index: number) => resolvedAssetsDictionary[index]);
}
