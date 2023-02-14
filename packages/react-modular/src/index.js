import { invariant } from '@pixi/react-invariant';

/**
 * Inject types
 *
 * @type {Object}
 */
export const COMPONENTS = {};

/**
 * Create Component
 *
 * @param {string} type
 * @param {Object} lifecycle methods
 */
export function PixiComponent(type, lifecycle)
{
    invariant(!!type, 'Expect type to be defined, got `%s`', type);
    invariant(
        !COMPONENTS[type],
        'Component `%s` could not be created, a component with that name already exists.',
        type
    );

    COMPONENTS[type] = lifecycle;

    return type;
}

export function configurePixiReact({
    configurePixiReactHostConfig,
    configurePixiReactFiber,
    configurePixiReactComponents,
    configurePixiReactStage,
    configurePixiReactRenderAPI,
})
{
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
    const { createRoot, render, unmountComponentAtNode }
        = configurePixiReactRenderAPI(PixiReactFiber);

    return {
        // From pixi-react-fiber, hostConfig exposed for testing purposes only
        PixiReactFiber,
        // From pixi-react-components
        TYPES,
        createRoot,
        render,
        unmountComponentAtNode,
        Stage,
    };
}
