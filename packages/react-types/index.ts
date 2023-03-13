import type React from 'react';
import type { Component, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

export type PropsType = { [key: string]: any };

interface MinimalDisplayObject
{
    emit: (type: any, data: any) => void;
    visible: boolean;
    destroy: (opts: { children?: boolean; texture?: boolean; baseTexture?: boolean }) => void;
}

// Defines a minimal expected type for a PIXI Container to allow for different implementations across PIXI versions
export interface MinimalContainer extends MinimalDisplayObject
{
    children: any[];
    addChild: (...children: any[]) => any;
    removeChild: (child: any) => void;
    getChildIndex: (child: any) => number;
    setChildIndex: (child: any, index: number) => void;
    addChildAt: (child: any, index: number) => void;
}

export type LocalState<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = {
    root: Container | null;
    parent: Container | null;
    previousAttach: any;
    attach?: AttachType<Container, Instance>;
    attachedObjects: Container[];
};

export interface PixiReactMinimalExpandoContainer extends MinimalContainer
{
    config?: lifeCycleConfigType;
    applyProps?: applyPropsType<PropsType, any>;
    didMount?: didMountType<any, any>;
    willUnmount?: willUnmountType<any, any>;
    __reactpixi?: LocalState<any, any>;
}

// TODO: defining twice like this seems to be the only way to get around an
// issue with circular references and the fact this version uses generics
export type PixiReactExpandoContainer<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = {
    config?: lifeCycleConfigType;
    applyProps?: applyPropsType<PropsType, Instance>;
    didMount?: didMountType<Container, Instance>;
    willUnmount?: willUnmountType<Container, Instance>;
    __reactpixi?: LocalState<Container, Instance>;
};

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>;
}[keyof T];

type AnySource<PixiTexture> = number | ImageSource | VideoSource | HTMLCanvasElement | PixiTexture;

export type PointCoords = [number, number] | [number];
export type PointLike<PixiPoint, PixiObservablePoint> =
    | PixiPoint
    | PixiObservablePoint
    | PointCoords
    | number
    | { x?: number; y?: number }
    | string;

type WithPointLike<PixiPoint, PixiObservablePoint, T extends keyof any> = {
    [P in T]: PointLike<PixiPoint, PixiObservablePoint>;
};

export type AttachFnType<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = (parent: Container, self: Instance) => (parent: Container, self: Instance) => void;
export type AttachType<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = string | AttachFnType<Container, Instance>;

type WithAttach<Container extends PixiReactMinimalExpandoContainer, Instance extends PixiReactMinimalExpandoContainer> = {
    attach?: AttachType<Container, Instance>;
};

export interface WithSource<PixiTexture>
{
    /**
     * Directly apply an image
     *
     * @example
     *
     * image="./image.png"
     */
    image?: ImageSource;

    /**
     * Directly apply a video
     *
     * @example
     *
     * video="./video.mp4"
     */
    video?: VideoSource;

    /**
     * Directly apply an already created PixiJS Texture
     */
    texture?: PixiTexture;

    /**
     * Directly apply a source.
     * Can be an image, video, canvas, frame id or even a texture
     *
     * @example
     *
     * source="./image.jpg"
     * source="./video.mp4"
     * source={document.querySelector('img')}
     * source={document.querySelector('video')}
     * source={document.querySelector('canvas')}
     */
    source?: AnySource<PixiTexture>;
}

export type InstanceProps<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = PropsType & WithAttach<Container, Instance>;

// This helper is used to create types for the prop argument to React.FC
export type ReactContainerProps<
    PixiPoint,
    PixiObservablePoint,
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
    Props = object,
> = Partial<
Omit<Instance, 'children' | PointLikeProps | ReadonlyKeys<Instance> | keyof Props> &
WithPointLike<PixiPoint, PixiObservablePoint, PointLikeProps>
> &
WithAttach<Container, Instance> &
Props &
InteractionEvents & { ref?: React.Ref<Instance> };

// This helper is used to create types for the return argument of component lifecycle create
export type PixiReactContainer<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = Instance & PixiReactExpandoContainer<Container, Instance>;

export type UpdatePayload = Array<any> | null;

export type NoTimeout = -1;

export type TimeoutHandle = ReturnType<typeof setTimeout>;

// Defines a minimal expected type for PixiReactFiber to allow for different implementations across React versions
export type createInstanceType<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = (type: string, props: PropsType, rootContainer: Container, hostContext: any, internalHandle: any) => Instance;

export type MinimalHostConfig<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = {
    supportsMutation: boolean;
    supportsPersistence: boolean;
    createInstance: createInstanceType<Container, Instance>;
    createTextInstance(text: string, rootContainer: Container, hostContext: any, internalHandle: any): any;
    appendInitialChild(parentInstance: Container, child: Instance): void;
    finalizeInitialChildren(
        instance: Instance,
        type: string,
        props: PropsType,
        rootContainer: Container,
        hostContext: any,
    ): boolean;
    prepareUpdate(
        instance: Instance,
        type: string,
        oldProps: PropsType,
        newProps: PropsType,
        rootContainer: Container,
        hostContext: any,
    ): UpdatePayload;
    shouldSetTextContent(type: string, props: PropsType): boolean;
    getRootHostContext(rootContainer: Container): any;
    getChildHostContext(parentHostContext: any, type: string, rootContainer: Container): any;
    getPublicInstance(instance: Instance): Instance;
    prepareForCommit(containerInfo: Container): Record<string, any> | null;
    resetAfterCommit(containerInfo: Container): void;
    preparePortalMount(containerInfo: Container): void;
    scheduleTimeout(fn: (...args: unknown[]) => unknown, delay?: number): TimeoutHandle;
    cancelTimeout(id: TimeoutHandle): void;
    noTimeout: NoTimeout;
    supportsMicrotasks?: boolean;
    scheduleMicrotask?(fn: () => unknown): void;
    isPrimaryRenderer: boolean;
    warnsIfNotActing?: boolean;
    getCurrentEventPriority(): any;
    getInstanceFromNode(node: any): any;
    beforeActiveInstanceBlur(): void;
    afterActiveInstanceBlur(): void;
    prepareScopeUpdate(scopeInstance: any, instance: any): void;
    getInstanceFromScope(scopeInstance: any): null | Instance;
    detachDeletedInstance(node: Instance): void;
    appendChild?(parentInstance: Container, child: Instance): void;
    appendChildToContainer?(container: Container, child: Instance): void;
    insertBefore?(parentInstance: Container, child: Instance, beforeChild: Container): void;
    insertInContainerBefore?(container: Container, child: Instance, beforeChild: Container): void;
    removeChild?(parentInstance: Container, child: Instance): void;
    removeChildFromContainer?(container: Container, child: Instance): void;
    resetTextContent?(instance: Instance): void;
    commitTextUpdate?(textInstance: Instance, oldText: string, newText: string): void;
    commitMount?(instance: Instance, type: string, props: PropsType, internalInstanceHandle: any): void;
    commitUpdate?(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: string,
        prevProps: any,
        nextProps: any,
        internalHandle: any,
    ): void;
    hideInstance?(instance: Instance): void;
    hideTextInstance?(textInstance: Instance): void;
    unhideInstance?(instance: Instance, props: PropsType): void;
    unhideTextInstance?(textInstance: Instance, text: string): void;
    clearContainer?(container: Container): void;
    cloneInstance?(
        instance: Instance,
        updatePayload: UpdatePayload,
        type: string,
        oldProps: PropsType,
        newProps: PropsType,
        internalInstanceHandle: any,
        keepChildren: boolean,
        recyclableInstance: Container,
    ): Container;
    createContainerChildSet?(container: Container): any;
    appendChildToContainerChildSet?(childSet: any, child: Instance): void;
    finalizeContainerChildren?(container: Container, newChildren: any): void;
    replaceContainerChildren?(container: Container, newChildren: any): void;
    cloneHiddenInstance?(instance: Instance, type: string, props: PropsType, internalInstanceHandle: any): Instance;
    cloneHiddenTextInstance?(instance: Instance, text: any, internalInstanceHandle: any): Instance;
    supportsHydration: boolean;
    canHydrateInstance?(instance: Instance, type: string, props: PropsType): null | Instance;
    canHydrateTextInstance?(instance: Instance, text: string): null | Instance;
    canHydrateSuspenseInstance?(instance: Instance): null | Instance;
    isSuspenseInstancePending?(instance: Instance): boolean;
    isSuspenseInstanceFallback?(instance: Instance): boolean;
    registerSuspenseInstanceRetry?(instance: Instance, callback: () => void): void;
    getNextHydratableSibling?(instance: Instance): null | Instance;
    getFirstHydratableChild?(parentInstance: Container): null | Container;
    hydrateInstance?(
        instance: Instance,
        type: string,
        props: PropsType,
        rootContainerInstance: Container,
        hostContext: any,
        internalInstanceHandle: any,
    ): null | any[];
    hydrateTextInstance?(textInstance: Instance, text: string, internalInstanceHandle: any): boolean;
    hydrateSuspenseInstance?(suspenseInstance: Instance, internalInstanceHandle: any): void;
    getNextHydratableInstanceAfterSuspenseInstance?(suspenseInstance: Instance): null | Instance;
    getParentSuspenseInstance?(targetInstance: any): null | Instance;
    commitHydratedContainer?(container: Container): void;
    commitHydratedSuspenseInstance?(suspenseInstance: Instance): void;
    didNotMatchHydratedContainerTextInstance?(parentContainer: Container, textInstance: Instance, text: string): void;
    didNotMatchHydratedTextInstance?(
        parentType: any,
        parentProps: PropsType,
        parentInstance: Container,
        textInstance: Instance,
        text: string,
    ): void;
    didNotHydrateContainerInstance?(parentContainer: Container, instance: Instance): void;
    didNotHydrateInstance?(parentType: any, parentProps: PropsType, parentInstance: Container, instance: Instance): void;
    didNotFindHydratableContainerInstance?(parentContainer: Container, type: string, props: PropsType): void;
    didNotFindHydratableContainerTextInstance?(parentContainer: Container, text: string): void;
    didNotFindHydratableContainerSuspenseInstance?(parentContainer: Container): void;
    didNotFindHydratableInstance?(
        parentType: any,
        parentProps: PropsType,
        parentInstance: Container,
        type: string,
        props: PropsType,
    ): void;
    didNotFindHydratableTextInstance?(
        parentType: any,
        parentProps: PropsType,
        parentInstance: Container,
        text: string,
    ): void;
    didNotFindHydratableSuspenseInstance?(parentType: any, parentProps: PropsType, parentInstance: Container): void;
    errorHydratingContainer?(parentContainer: Container): void;
};

export type MinimalPixiReactFiber<Container extends MinimalContainer> = {
    createContainer: (
        containerInfo: Container,
        tag: any,
        hydrationCallbacks: any,
        isStrictMode: boolean,
        concurrentUpdatesByDefaultOverride: null | boolean,
        identifierPrefix: string,
        onRecoverableError: (error: Error) => void,
        transitionCallbacks: any,
    ) => any;
    updateContainer: (
        element: React.ReactNode | null,
        container: any,
        parentComponent?: Component<any, any> | null,
        callback?: (() => void) | null,
    ) => number;
    getPublicRootInstance: (container: any) => Component<any, any> | Container | null;
};

export type ReactRoot = {
    render: (element: JSX.Element) => any;
    unmount: () => void;
};

export type RootEntry = {
    pixiFiberContainer: any;
    reactRoot: ReactRoot;
};

export type Roots<Container extends MinimalContainer> = Map<Container, RootEntry>;

export type CreateRootType<Container extends MinimalContainer> = (container: Container) => ReactRoot;

export type RenderType<Container extends MinimalContainer> = (
    element: JSX.Element,
    container: Container,
    callback?: () => void,
) => any;

export type UnmountComponentAtNodeType<Container extends MinimalContainer> = (container: Container) => void;

type MountUnmountType<Application> = (app: Application) => void;

export type DisplayObjectSettableProperty =
    | 'alpha'
    | 'buttonMode'
    | 'cacheAsBitmap'
    | 'cursor'
    | 'filterArea'
    | 'filters'
    | 'hitArea'
    | 'interactive'
    | 'mask'
    | 'pivot'
    | 'position'
    | 'renderable'
    | 'rotation'
    | 'scale'
    | 'skew'
    | 'transform'
    | 'visible'
    | 'x'
    | 'y';

type InteractionEventTypes =
    | 'click'
    | 'mousedown'
    | 'mousemove'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'mouseupoutside'
    | 'tap'
    | 'touchstart'
    | 'touchmove'
    | 'touchend'
    | 'touchendoutside'
    | 'pointercancel'
    | 'pointerout'
    | 'pointerover'
    | 'pointertap'
    | 'pointerdown'
    | 'pointerup'
    | 'pointerupoutside'
    | 'pointermove'
    | 'rightclick'
    | 'rightdown'
    | 'rightup'
    | 'rightupoutside'
    | 'touchcancel';

export type InteractionEvents = {
    [P in InteractionEventTypes]?: (event: any) => void;
};

export type PointLikeProps = 'position' | 'scale' | 'pivot' | 'anchor' | 'skew';

export type ImageSource = string | HTMLImageElement;
export type VideoSource = string | HTMLVideoElement;

export type HTMLCanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

export type StageProps<Application, ApplicationOptions> = HTMLCanvasProps & {
    children: React.ReactNode;
    width?: number;
    height?: number;
    onMount?: MountUnmountType<Application>;
    onUnmount?: MountUnmountType<Application>;
    raf?: boolean;
    renderOnComponentChange?: boolean;
    options?: Partial<ApplicationOptions>;
};

export type StagePropsWithFiber<Application, ApplicationOptions, PixiContainer extends MinimalContainer> = StageProps<
Application,
ApplicationOptions
> & {
    pixiReactFiberInstance: MinimalPixiReactFiber<PixiContainer>;
};

// TODO: Is it possible to write a forwardRef compatible interface for BaseStage?
// export interface IBaseStage<Application, IApplicationOptions, PixiContainer extends MinimalContainer, Ticker>
//     extends React.Component<Required<StagePropsWithFiber<Application, IApplicationOptions, PixiContainer>>>
// {
//     _canvas: HTMLCanvasElement | null;
//     _mediaQuery: MediaQueryList | null;
//     _ticker: Ticker | null;
//     _needsUpdate: boolean;
//     app: Application | null;
//     mountNode: any;
//     updateSize: () => void;
//     needsRenderUpdate: () => void;
//     renderStage: () => void;
//     resetInteractionManager: () => void;
//     getChildren: () => any;
// }
//
// export type ReactStageComponent<
//     Application,
//     ApplicationOptions,
//     PixiContainer extends MinimalContainer,
//     Ticker,
// > = ForwardRefExoticComponent<
// PropsWithoutRef<StageProps<Application, ApplicationOptions>> &
// RefAttributes<IBaseStage<Application, ApplicationOptions, PixiContainer, Ticker>>
// >;

export type ReactStageComponent<BaseStage, Application, ApplicationOptions> = ForwardRefExoticComponent<
PropsWithoutRef<StageProps<Application, ApplicationOptions>> & RefAttributes<BaseStage>
>;

export type applyPropsType<P extends PropsType, Instance extends PixiReactMinimalExpandoContainer> = (
    instance: Instance,
    oldProps: Readonly<P>,
    newProps: Readonly<P>,
) => boolean;

export type didMountType<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = (instance: Instance, parent: Container) => void;

export type willUnmountType<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = (instance: Instance, parent: Container) => void;

export type lifeCycleConfigType = {
    /**
     * Destroy instance on unmount?
     * @default true
     */
    destroy?: boolean;

    /**
     * Destroy child instances?
     * @default true
     */
    destroyChildren?: boolean;

    /**
     * Destroy underlying Texture instance
     * @default false
     */
    destroyTexture?: boolean;

    /**
     * Destroy underlying BaseTexture instance
     * @default false
     */
    destroyBaseTexture?: boolean;
};

// Used in place of ICustomComponent for internal components
export type createCustomComponentType<
    P extends PropsType,
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = (root: Container, props: P) => Instance;

export interface ICustomComponent<
    P extends PropsType,
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>
{
    /**
     * Create the PIXI instance
     * The component is created during React reconciliation.
     *
     * @param props passed down props
     * @param {PixiContainer} root passed down props
     * @returns {PixiContainer}
     */
    create(props: P, root?: Container | null): Instance;

    /**
     * Instance mounted
     * This is called during React reconciliation.
     *
     * @param {PixiContainer} instance
     * @param {PixiContainer} parent
     */
    didMount?: didMountType<Container, Instance>;

    /**
     * Instance will unmount
     * This is called during React reconciliation.
     *
     * @param {PixiContainer} instance
     * @param {PixiContainer} parent
     */
    willUnmount?: willUnmountType<Container, Instance>;

    /**
     * Apply props for this custom component.
     * This is called during React reconciliation.
     *
     * @param {PixiContainer} instance
     * @param oldProps
     * @param newProps
     */
    applyProps?: applyPropsType<P, Instance>;

    /**
     * Reconcile config
     */
    config?: lifeCycleConfigType;
}

export type ComponentType<
    P extends PropsType,
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
> = createCustomComponentType<P, Container, Instance> | ICustomComponent<P, Container, Instance>;

export type ComponentsType = Record<string, ComponentType<any, any, any>>;

export type PixiComponentType = <
    P extends PropsType,
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(
    type: string,
    lifecycle: ComponentType<P, Container, Instance>,
) => React.ComponentType<P>;

export type PixiReactRenderEventType =
    | 'appendInitialChild'
    | 'appendChild'
    | 'appendChildToContainer'
    | 'removeChild'
    | 'removeChildFromContainer'
    | 'insertInContainerBefore'
    | 'commitUpdate';

export type PixiReactRenderEventPayload = {
    detail: PixiReactRenderEventType;
};
