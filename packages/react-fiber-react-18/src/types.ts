import type { HostConfig, Reconciler } from 'react-reconciler';
import type {
    NoTimeout,
    PixiReactMinimalExpandoContainer,
    PropsType,
    TimeoutHandle,
    UpdatePayload,
} from '@pixi/react-types';

export type PixiReactHostConfig<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = HostConfig<
string,
PropsType,
Container,
Instance,
any,
Instance,
Instance,
Instance,
any,
UpdatePayload,
any,
TimeoutHandle,
NoTimeout
>;

export type PixiReactReconciler<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = Reconciler<Container, Instance, any, Instance, Instance>;

export type diffPropertiesType<PixiContainer> = (
    instance: PixiContainer,
    type: string,
    lastProps: PropsType,
    nextProps: PropsType,
) => UpdatePayload;
