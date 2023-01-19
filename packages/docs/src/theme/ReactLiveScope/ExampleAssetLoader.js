import React, { useEffect, useState } from 'react';
import { Assets } from 'pixi.js';

// Helper Component to ensure assets are loaded for docusaurus live examples
const ExampleAssetLoader = ({ name, url, loader, children }) =>
{
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() =>
    {
        const loadAsset = async () =>
        {
            Assets.add(name, url);

            await Assets.load(name);
            setIsLoaded(true);
        };

        loadAsset().catch(console.error);
    }, [name, url]);

    return isLoaded ? children : loader;
};

export default ExampleAssetLoader;
