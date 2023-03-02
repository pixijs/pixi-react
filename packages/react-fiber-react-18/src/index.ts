import Reconciler from 'react-reconciler';
import type { applyPropsType, ComponentType, PropsType, PixiReactMinimalExpandoContainer } from '@pixi/react-types';
import data from './data.json';
import { makeHostConfig } from './hostconfig';
import type { diffPropertiesType, PixiReactHostConfig, PixiReactReconciler } from './types';

export type { PixiReactHostConfig, PixiReactReconciler };

export function configurePixiReactHostConfig<ExpandoContainer extends PixiReactMinimalExpandoContainer>({
    COMPONENTS,
    applyDefaultProps,
    diffProperties,
}: {
    COMPONENTS: Record<string, ComponentType<PropsType, ExpandoContainer>>;
    applyDefaultProps: applyPropsType<PropsType, ExpandoContainer>;
    diffProperties?: diffPropertiesType<ExpandoContainer>;
})
{
    return makeHostConfig<ExpandoContainer>({ COMPONENTS, applyDefaultProps, diffProperties });
}

export function configurePixiReactFiber<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    hostConfig: PixiReactHostConfig<ExpandoContainer>,
): PixiReactReconciler<ExpandoContainer>
{
    const PixiReactFiber = Reconciler(hostConfig);

    PixiReactFiber.injectIntoDevTools({
        bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
        version: data.REACT_DOM_VERSION,
        rendererPackageName: data.PACKAGE_NAME,
    });

    return PixiReactFiber;
}
