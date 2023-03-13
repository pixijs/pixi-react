import Reconciler from 'react-reconciler';
import type { applyPropsType, ComponentType, PropsType, PixiReactMinimalExpandoContainer } from '@pixi/react-types';
import data from './data.json';
import { makeHostConfig } from './hostconfig';
import type { diffPropertiesType, PixiReactHostConfig, PixiReactReconciler } from './types';

export type { PixiReactHostConfig, PixiReactReconciler };

export function configurePixiReactHostConfig<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>({
    COMPONENTS,
    applyDefaultProps,
    diffProperties,
}: {
    COMPONENTS: Record<string, ComponentType<PropsType, Container, Instance>>;
    applyDefaultProps: applyPropsType<PropsType, Instance>;
    diffProperties?: diffPropertiesType<Instance>;
})
{
    return makeHostConfig<Container, Instance>({ COMPONENTS, applyDefaultProps, diffProperties });
}

export function configurePixiReactFiber<
    PixiContainer extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(hostConfig: PixiReactHostConfig<PixiContainer, Instance>): PixiReactReconciler<PixiContainer, Instance>
{
    const PixiReactFiber = Reconciler(hostConfig);

    PixiReactFiber.injectIntoDevTools({
        bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
        version: data.REACT_DOM_VERSION,
        rendererPackageName: data.PACKAGE_NAME,
    });

    return PixiReactFiber;
}
