import type { UnresolvedAsset } from 'pixi.js';

/** Loads assets, returning a hash of assets once they're loaded. */
export function getAssetKeyFromOptions<T>(options: UnresolvedAsset<T> | string)
{
    let assetKey;

    if (typeof options === 'string')
    {
        assetKey = options;
    }
    else
    {
        assetKey = (options.alias ?? options.src) as string;
    }

    return assetKey;
}
