import { configurePixiReact } from '@pixi/react-modular';
import { configurePixiReactFiber, configurePixiReactHostConfig } from '@pixi/react-fiber';
import { configurePixiReactComponents, configurePixiReactStage, configurePixiReactRenderAPI } from '@pixi/react-components';
import type { PixiReactHostConfig, PixiReactReconciler } from '@pixi/react-fiber';
import type { PixiReactContainer, ReactStageComponent } from '@pixi/react-components';

const { PixiComponent, PixiReactFiber, Stage, createRoot, render, unmountComponentAtNode } = configurePixiReact<
ReactStageComponent,
PixiReactContainer,
PixiReactHostConfig<PixiReactContainer>,
PixiReactReconciler<PixiReactContainer>
>({
    configurePixiReactHostConfig,
    configurePixiReactFiber,
    configurePixiReactComponents,
    configurePixiReactStage,
    configurePixiReactRenderAPI,
});

export { PixiComponent, PixiReactFiber, Stage, createRoot, render, unmountComponentAtNode };
