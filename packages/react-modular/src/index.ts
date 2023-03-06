import { invariant } from '@pixi/react-invariant';
import type {
    applyPropsType,
    ComponentType,
    MinimalPixiReactFiber,
    PixiComponentType,
    PixiReactMinimalExpandoContainer,
    PropsType,
    Roots,
    CreateRootType,
    RenderType,
    UnmountComponentAtNodeType,
    MinimalContainer,
    MinimalHostConfig, ComponentsType
} from '@pixi/react-types';

type ConfigurePixiReactHostConfigType<
    ExpandoContainer extends PixiReactMinimalExpandoContainer,
    HostConfigType extends MinimalHostConfig<ExpandoContainer>,
> = (params: {
    COMPONENTS: Record<string, ComponentType<PropsType, ExpandoContainer>>;
    applyDefaultProps: applyPropsType<PropsType, ExpandoContainer>;
}) => HostConfigType;

type ConfigurePixiReactFiberType<
    ExpandoContainer extends PixiReactMinimalExpandoContainer,
    HostConfigType extends MinimalHostConfig<ExpandoContainer>,
    PixiReactFiberType extends MinimalPixiReactFiber<ExpandoContainer>,
> = (hostConfig: HostConfigType) => PixiReactFiberType;

type ConfigurePixiReactComponentsType<PixiContainer extends PixiReactMinimalExpandoContainer> = (
    pixiComponent: PixiComponentType,
) => {
    TYPES: Record<string, string>;
    applyDefaultProps: applyPropsType<PropsType, PixiContainer>;
};

type ConfigureStageType<
    ConcreteStageType,
    Container extends MinimalContainer,
    PixiReactFiberType extends MinimalPixiReactFiber<Container>,
> = (pixiReactFiber: PixiReactFiberType) => ConcreteStageType;

type ConfigurePixiReactRenderAPIType<
    Container extends MinimalContainer,
    PixiReactFiberType extends MinimalPixiReactFiber<Container>,
> = (pixiReactFiber: PixiReactFiberType) => {
    roots: Roots<Container>;
    createRoot: CreateRootType<Container>;
    render: RenderType<Container>;
    unmountComponentAtNode: UnmountComponentAtNodeType<Container>;
};

export function configurePixiComponent()
{
    const COMPONENTS: ComponentsType = {};

    /**
     * Create Component
     *
     * @param {string} type
     * @param {Object} lifecycle methods
     */
    function PixiComponent<P extends PropsType, PixiContainer extends PixiReactMinimalExpandoContainer>(
        type: string,
        lifecycle: ComponentType<P, PixiContainer>,
    )
    {
        invariant(!!type, 'Expect type to be defined, got `%s`', type);
        invariant(
            !COMPONENTS[type],
            'Component `%s` could not be created, a component with that name already exists.',
            type,
        );

        COMPONENTS[type] = lifecycle;

        return type as unknown as React.ComponentType<P>;
    }

    return { COMPONENTS, PixiComponent };
}

export function configurePixiReact<
    ConcreteStageType,
    PixiContainer extends PixiReactMinimalExpandoContainer,
    HostConfigType extends MinimalHostConfig<PixiContainer>,
    PixiReactFiberType extends MinimalPixiReactFiber<PixiContainer>,
>({
    configurePixiReactHostConfig,
    configurePixiReactFiber,
    configurePixiReactComponents,
    configurePixiReactStage,
    configurePixiReactRenderAPI,
}: {
    configurePixiReactHostConfig: ConfigurePixiReactHostConfigType<PixiContainer, HostConfigType>;
    configurePixiReactFiber: ConfigurePixiReactFiberType<PixiContainer, HostConfigType, PixiReactFiberType>;
    configurePixiReactComponents: ConfigurePixiReactComponentsType<PixiContainer>;
    configurePixiReactStage: ConfigureStageType<ConcreteStageType, PixiContainer, PixiReactFiberType>;
    configurePixiReactRenderAPI: ConfigurePixiReactRenderAPIType<PixiContainer, PixiReactFiberType>;
})
{
    const { COMPONENTS, PixiComponent } = configurePixiComponent();

    // `configurePixiReactComponents` depends on this module's `PixiComponent` in order to build and store references to
    // instances of the default PixiReact component types
    const {
        // TODO: do we actually need to return this here, could just be imported by consumer, it depends if packages might
        // want to create more than the current set of TYPES
        TYPES,
        // TODO: same here... also consider moving applyDefaultProps to its own package
        applyDefaultProps,
    } = configurePixiReactComponents(PixiComponent);

    // Most of the React Reconciler is static, the exceptions are:
    // 1) `createElement` depends on `COMPONENTS` which is defined above in this module `react-modular` but configured by
    //    the previous step `configurePixiReactComponents`
    // 2) `commitUpdate` depends on `applyDefaultProps` which comes from the previous `configurePixiReactComponents` step
    const hostConfig = configurePixiReactHostConfig({
        COMPONENTS,
        applyDefaultProps,
    });
    const PixiReactFiber = configurePixiReactFiber(hostConfig);

    const Stage = configurePixiReactStage(PixiReactFiber);

    // `configurePixiReactRenderAPI` needs access to a `PixiReactFiber` instance in order to build the
    // `createRoot` / `render` API
    const { createRoot, render, unmountComponentAtNode } = configurePixiReactRenderAPI(PixiReactFiber);

    return {
        // From this module
        COMPONENTS,
        PixiComponent,
        // From pixi-react-fiber
        PixiReactFiber,
        // From pixi-react-components
        TYPES,
        createRoot,
        render,
        unmountComponentAtNode,
        Stage,
    };
}
