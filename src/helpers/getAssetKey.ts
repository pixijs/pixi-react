import { type UnresolvedAsset } from '../typedefs/UnresolvedAsset';

/** Retrieves the key from an unresolved asset. */
export function getAssetKey<T>(asset: UnresolvedAsset<T>)
{
    let assetKey;

    if (typeof asset === 'string')
    {
        assetKey = asset;
    }
    else
    {
        assetKey = (asset.alias ?? asset.src) as string;
    }

    return assetKey;
}
