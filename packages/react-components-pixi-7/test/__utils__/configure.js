import { COMPONENTS, PixiComponent } from '@pixi/react-modular';
import {
    configurePixiReactFiber,
    configurePixiReactHostConfig,
} from '@pixi/react-fiber';
import {
    TYPES,
    applyDefaultProps,
    configurePixiReactComponents,
    configurePixiReactRenderAPI,
    configurePixiReactStage,
} from '../../src';

const identity = (val) => val;

// Manual configuration of pixi-react to allow access to non-exported members as well as setting up spying
// pretty much copy-paste of react-modular package
export function configure({
    spyOnHostConfig = identity,
    spyOnPixiFiber = identity
} = {})
{
    configurePixiReactComponents(PixiComponent);

    const hostConfig = spyOnHostConfig(
        configurePixiReactHostConfig({
            COMPONENTS,
            applyDefaultProps,
        })
    );
    const PixiReactFiber = spyOnPixiFiber(
        configurePixiReactFiber(hostConfig)
    );

    const Stage = configurePixiReactStage(PixiReactFiber);
    const { roots, createRoot, render, unmountComponentAtNode }
        = configurePixiReactRenderAPI(PixiReactFiber);

    return {
        TYPES,
        ...TYPES,
        hostConfig,
        PixiReactFiber,
        roots,
        createRoot,
        render,
        unmountComponentAtNode,
        Stage,
    };
}

export function clearComponents()
{
    Object.keys(COMPONENTS).forEach((type) =>
    {
        delete COMPONENTS[type];
    });
}
