import { configurePixiComponent } from '@pixi/react-modular';
import { configurePixiReactFiber, configurePixiReactHostConfig } from '@pixi/react-fiber';
import type { CreateRootType, RenderType, Roots, UnmountComponentAtNodeType } from '@pixi/react-types';
import {
    TYPES,
    applyDefaultProps,
    configurePixiReactComponents,
    configurePixiReactRenderAPI,
    configurePixiReactStage,
} from '../../src';
import type { PixiReactHostConfig, PixiReactReconciler } from '@pixi/react-fiber';
import type { PixiReactContainer, ReactStageComponent } from '../../src/types';
import type { Container } from '@pixi/display';

type IdentityType<Type> = (arg: Type) => Type;
const identity: IdentityType<any> = (val) => val;

// Manual configuration of pixi-react to allow access to non-exported members as well as setting up spying
// pretty much copy-paste of react-modular package
export function configure({
    spyOnHostConfig = identity,
    spyOnPixiFiber = identity,
}: {
    spyOnHostConfig?: IdentityType<PixiReactHostConfig<PixiReactContainer, PixiReactContainer>>;
    spyOnPixiFiber?: IdentityType<PixiReactReconciler<PixiReactContainer, PixiReactContainer>>;
} = {})
{
    const { COMPONENTS, PixiComponent } = configurePixiComponent();

    configurePixiReactComponents(PixiComponent);

    const hostConfig = spyOnHostConfig(
        configurePixiReactHostConfig({
            COMPONENTS,
            applyDefaultProps,
        })
    );
    const PixiReactFiber = spyOnPixiFiber(configurePixiReactFiber(hostConfig));

    const Stage: ReactStageComponent = configurePixiReactStage(PixiReactFiber);
    const {
        roots,
        createRoot,
        render,
        unmountComponentAtNode,
    }: {
        roots: Roots<Container>;
        createRoot: CreateRootType<Container>;
        render: RenderType<Container>;
        unmountComponentAtNode: UnmountComponentAtNodeType<Container>;
    } = configurePixiReactRenderAPI(PixiReactFiber);

    return {
        COMPONENTS,
        TYPES,
        ...TYPES,
        hostConfig,
        PixiComponent,
        PixiReactFiber,
        roots,
        createRoot,
        render,
        unmountComponentAtNode,
        Stage,
    };
}
