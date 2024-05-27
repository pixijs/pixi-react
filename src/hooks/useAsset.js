import { Assets } from 'pixi.js';
import {
    useEffect,
    useState,
} from 'react';

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
 * @returns {Texture} A hash of textures, keyed by their URLs.
 */
export function useAsset(options, onProgress)
{
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [texture, setTexture] = useState(null);

    useEffect(() =>
    {
        setIsLoaded(false);
    }, [options]);

    useEffect(() =>
    {
        if (!isLoaded && !isLoading)
        {
            setIsLoading(true);

            Assets.add(options);
            Assets
                .load(options.alias ?? options.src, onProgress)
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
