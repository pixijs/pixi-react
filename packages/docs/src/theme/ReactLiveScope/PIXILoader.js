import React, { useEffect, useState } from 'react';
import { Loader } from 'pixi.js';

const PIXILoader = ({ name, url, loader, children }) =>
{
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() =>
    {
        const loader = new Loader();

        loader.add(name, url).load(() =>
        {
            setIsLoaded(true);
        });

        return () => loader.destroy();
    }, [name, url]);

    return isLoaded ? children : loader;
};

export default PIXILoader;
