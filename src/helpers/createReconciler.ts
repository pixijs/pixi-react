import Reconciler from "react-reconciler";
import packageData from '../../package.json' with { type: 'json' };

export function createReconciler<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    FormInstance,
    PublicInstance,
    HostContext,
    ChildSet,
    TimeoutHandle,
    NoTimeout,
    TransitionStatus
>(
    config: Reconciler.HostConfig<
        Type,
        Props,
        Container,
        Instance,
        TextInstance,
        SuspenseInstance,
        HydratableInstance,
        FormInstance,
        PublicInstance,
        HostContext,
        ChildSet,
        TimeoutHandle,
        NoTimeout,
        TransitionStatus
    >
): Reconciler.Reconciler<
        Container,
        Instance,
        TextInstance,
        SuspenseInstance,
        FormInstance,
        PublicInstance
    > {
    const reconciler = Reconciler({
        ...config,
        // @ts-expect-error https://github.com/facebook/react/pull/30522
        rendererPackageName: "@pixi/react",
        version: packageData.version,
    });

    // @ts-expect-error https://github.com/facebook/react/pull/30522
    reconciler.injectIntoDevTools();

    return reconciler as any;
}
