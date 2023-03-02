import type { HostConfig, Reconciler } from 'react-reconciler';
import type {
    NoTimeout,
    PixiReactMinimalExpandoContainer,
    PropsType,
    TimeoutHandle,
    UpdatePayload,
} from '@pixi/react-types';

export type PixiReactHostConfig<ExpandoContainer extends PixiReactMinimalExpandoContainer> = HostConfig<
string,
PropsType,
ExpandoContainer,
ExpandoContainer,
any,
ExpandoContainer,
ExpandoContainer,
ExpandoContainer,
any,
UpdatePayload,
any,
TimeoutHandle,
NoTimeout
>;

export type PixiReactReconciler<ExpandoContainer extends PixiReactMinimalExpandoContainer> = Reconciler<
ExpandoContainer,
ExpandoContainer,
any,
ExpandoContainer,
ExpandoContainer
>;

export type diffPropertiesType<PixiContainer> = (
    instance: PixiContainer,
    type: string,
    lastProps: PropsType,
    nextProps: PropsType,
) => UpdatePayload;
