import {
    Assets,
    Cache,
} from 'pixi.js';
import { useState } from 'react';
import { getAssetKey } from '../helpers/getAssetKey.ts';
import { UseAssetsStatus } from '../typedefs/UseAssetsStatus.ts';

import type { AssetRetryState } from '../typedefs/AssetRetryState.ts';
import type { UnresolvedAsset } from '../typedefs/UnresolvedAsset.ts';
import type { UseAssetsOptions } from '../typedefs/UseAssetsOptions.ts';
import type { UseAssetsResult } from '../typedefs/UseAssetsResult.ts';

const errorCache: Map<UnresolvedAsset, AssetRetryState> = new Map();

function assetsLoadedTest<T>(asset: UnresolvedAsset<T>)
{
    return Cache.has(getAssetKey(asset));
}

/** Loads assets, returning a hash of assets once they're loaded. */
export function useAssets<T = any>(
    /** @description Assets to be loaded. */
    assets: UnresolvedAsset<T>[],

    /** @description Asset options. */
    options: UseAssetsOptions = {},
): UseAssetsResult<T>
{
    const [state, setState] = useState<UseAssetsResult<T>>({
        assets: Array(assets.length).fill(null),
        isError: false,
        isPending: true,
        isSuccess: false,
        status: UseAssetsStatus.Pending,
    });

    if (typeof window === 'undefined')
    {
        return state;
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

            setState((previousState) => ({
                ...previousState,
                error: cachedState?.error,
                isError: true,
                isPending: false,
                isSuccess: false,
                status: UseAssetsStatus.Error,
            }));
        }

        Assets
            .load<T>(assets, (progressValue) =>
        {
            if (typeof onProgress === 'function')
            {
                onProgress(progressValue);
            }
        })
            .then(() =>
            {
                const assetKeys = assets.map((asset: UnresolvedAsset<T>) => getAssetKey(asset));
                const resolvedAssetsDictionary = Assets.get<T>(assetKeys) as Record<string, T>;

                setState((previousState) => ({
                    ...previousState,
                    assets: assets.map((_asset: UnresolvedAsset<T>, index: number) => resolvedAssetsDictionary[index]),
                    isError: false,
                    isPending: false,
                    isSuccess: true,
                    status: UseAssetsStatus.Success,
                }));
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

    return state;
}
