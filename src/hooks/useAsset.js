import { Assets } from 'pixi.js';
import {
    useEffect,
    useState,
} from 'react';
import { isEqual } from '../helpers/compare.js';

/**
 * @typedef {import('pixi.js').ProgressCallback} ProgressCallback
 * @typedef {import('pixi.js').Texture} Texture
 * @typedef {import('pixi.js').UnresolvedAsset} UnresolvedAsset
 */

/**
 * Loads assets, returning a hash of assets once they're loaded.
 *
 * @param {UnresolvedAsset} options Asset options.
 * @param {ProgressCallback} [onProgress] A function to be called when the asset loader reports loading progress.
 * @returns {null | Texture} A hash of textures, keyed by their URLs. This will be `null` until the assets are loaded.
 */
export function useAsset(options, onProgress)
{
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [memoizedOptions, setMemoizedOptions] = useState(options);
    const [texture, setTexture] = useState(null);

    useEffect(() =>
    {
        if (isEqual(options, memoizedOptions))
        {
            setMemoizedOptions(options);
            setIsLoaded(false);
        }
    }, [
        memoizedOptions,
        options,
    ]);

    useEffect(() =>
    {
        if (!isLoaded && !isLoading)
        {
            setIsLoading(true);

            const assetKey = /** @type {string} */ (options.alias ?? options.src);

            Assets.add(options);
            Assets
                .load(assetKey, onProgress)
                .then((texture) =>
                {
                    setTexture(texture);
                    setIsLoaded(true);
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        }
    }, [
        isLoaded,
        isLoading,
    ]);

    return texture;
}
