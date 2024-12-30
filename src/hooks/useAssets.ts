import {
    Assets,
    Cache,
} from 'pixi.js';
import { useState } from 'react';
import { UseAssetsStatus } from '../constants/UseAssetsStatus';
import { getAssetKey } from '../helpers/getAssetKey';
import { type AssetRetryState } from '../typedefs/AssetRetryState';
import { type UnresolvedAsset } from '../typedefs/UnresolvedAsset';
import { type UseAssetsOptions } from '../typedefs/UseAssetsOptions';
import { type UseAssetsResult } from '../typedefs/UseAssetsResult';

const errorCache: Map<UnresolvedAsset, AssetRetryState> = new Map();

function assetsLoadedTest<T>(asset: UnresolvedAsset<T>)
{
    return Cache.has(getAssetKey(asset));
}

function resolveAssets<T>(assets: UnresolvedAsset<T>[])
{
    const assetKeys = assets.map((asset: UnresolvedAsset<T>) => getAssetKey(asset));
    const resolvedAssetsDictionary = Assets.get<T>(assetKeys) as Record<string, T>;

    return {
        assets: assets.map((_asset: UnresolvedAsset<T>, index: number) => resolvedAssetsDictionary[index]),
        isError: false,
        isPending: false,
        isSuccess: true,
        status: UseAssetsStatus.SUCCESS,
    };
}

/** Loads assets, returning a hash of assets once they're loaded. */
export function useAssets<T = any>(
    /** @description Assets to be loaded. */
    assets: UnresolvedAsset[],

    /** @description Asset options. */
    options: UseAssetsOptions = {},
): UseAssetsResult<T>
{
    const allAssetsAreLoaded = assets.every((asset) => assetsLoadedTest<T>(asset));

    const [state, setState] = useState<UseAssetsResult<T>>(
        typeof window !== 'undefined' && allAssetsAreLoaded
            ? resolveAssets(assets)
            : {
                assets: Array(assets.length).fill(undefined),
                isError: false,
                isPending: true,
                isSuccess: false,
                status: UseAssetsStatus.PENDING,
            });

    const {
        maxRetries = 3,
        onError,
        onProgress,
        retryOnFailure = true,
    } = options;

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
                status: UseAssetsStatus.ERROR,
            }));
        }

        Assets.load<T>(assets, (progressValue) =>
        {
            if (typeof onProgress === 'function')
            {
                onProgress(progressValue);
            }
        })
            .then(() =>
            {
                setState((previousState) => ({
                    ...previousState,
                    ...resolveAssets(assets),
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
