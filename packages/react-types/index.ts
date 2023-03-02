import type { Component } from 'react';
import type React from 'react';
import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

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

export interface PixiReactMinimalExpandoContainer extends MinimalContainer
{
    config?: lifeCycleConfigType;
    applyProps?: applyPropsType<PropsType, any>;
    didMount?: didMountType<any>;
    willUnmount?: willUnmountType<any>;
    __reactpixi?: {
        root: any | null;
    };
}

export type UpdatePayload = Array<any> | null;

export type NoTimeout = -1;

export type TimeoutHandle = ReturnType<typeof setTimeout>;

// Defines a minimal expected type for PixiReactFiber to allow for different implementations across React versions
export type createInstanceType<Container extends PixiReactMinimalExpandoContainer> = (
    type: string,
    props: PropsType,
    rootContainer: Container,
    hostContext: any,
    internalHandle: any,
) => Container;

export type MinimalHostConfig<Container extends PixiReactMinimalExpandoContainer> = {
    supportsMutation: boolean;
    supportsPersistence: boolean;
    createInstance: createInstanceType<Container>;
    createTextInstance(text: string, rootContainer: Container, hostContext: any, internalHandle: any): any;
    appendInitialChild(parentInstance: Container, child: Container): void;
    finalizeInitialChildren(
        instance: Container,
        type: string,
        props: PropsType,
        rootContainer: Container,
        hostContext: any,
    ): boolean;
    prepareUpdate(
        instance: Container,
        type: string,
        oldProps: PropsType,
        newProps: PropsType,
        rootContainer: Container,
        hostContext: any,
    ): UpdatePayload;
    shouldSetTextContent(type: string, props: PropsType): boolean;
    getRootHostContext(rootContainer: Container): any;
    getChildHostContext(parentHostContext: any, type: string, rootContainer: Container): any;
    getPublicInstance(instance: Container): Container;
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
    getInstanceFromScope(scopeInstance: any): null | Container;
    detachDeletedInstance(node: Container): void;
    appendChild?(parentInstance: Container, child: Container): void;
    appendChildToContainer?(container: Container, child: Container): void;
    insertBefore?(parentInstance: Container, child: Container, beforeChild: Container): void;
    insertInContainerBefore?(container: Container, child: Container, beforeChild: Container): void;
    removeChild?(parentInstance: Container, child: Container): void;
    removeChildFromContainer?(container: Container, child: Container): void;
    resetTextContent?(instance: Container): void;
    commitTextUpdate?(textInstance: Container, oldText: string, newText: string): void;
    commitMount?(instance: Container, type: string, props: PropsType, internalInstanceHandle: any): void;
    commitUpdate?(
        instance: Container,
        updatePayload: UpdatePayload,
        type: string,
        prevProps: any,
        nextProps: any,
        internalHandle: any,
    ): void;
    hideInstance?(instance: Container): void;
    hideTextInstance?(textInstance: Container): void;
    unhideInstance?(instance: Container, props: PropsType): void;
    unhideTextInstance?(textInstance: Container, text: string): void;
    clearContainer?(container: Container): void;
    cloneInstance?(
        instance: Container,
        updatePayload: UpdatePayload,
        type: string,
        oldProps: PropsType,
        newProps: PropsType,
        internalInstanceHandle: any,
        keepChildren: boolean,
        recyclableInstance: Container,
    ): Container;
    createContainerChildSet?(container: Container): any;
    appendChildToContainerChildSet?(childSet: any, child: Container): void;
    finalizeContainerChildren?(container: Container, newChildren: any): void;
    replaceContainerChildren?(container: Container, newChildren: any): void;
    cloneHiddenInstance?(instance: Container, type: string, props: PropsType, internalInstanceHandle: any): Container;
    cloneHiddenTextInstance?(instance: Container, text: any, internalInstanceHandle: any): Container;
    supportsHydration: boolean;
    canHydrateInstance?(instance: Container, type: string, props: PropsType): null | Container;
    canHydrateTextInstance?(instance: Container, text: string): null | Container;
    canHydrateSuspenseInstance?(instance: Container): null | Container;
    isSuspenseInstancePending?(instance: Container): boolean;
    isSuspenseInstanceFallback?(instance: Container): boolean;
    registerSuspenseInstanceRetry?(instance: Container, callback: () => void): void;
    getNextHydratableSibling?(instance: Container): null | Container;
    getFirstHydratableChild?(parentInstance: Container): null | Container;
    hydrateInstance?(
        instance: Container,
        type: string,
        props: PropsType,
        rootContainerInstance: Container,
        hostContext: any,
        internalInstanceHandle: any,
    ): null | any[];
    hydrateTextInstance?(textInstance: Container, text: string, internalInstanceHandle: any): boolean;
    hydrateSuspenseInstance?(suspenseInstance: Container, internalInstanceHandle: any): void;
    getNextHydratableInstanceAfterSuspenseInstance?(suspenseInstance: Container): null | Container;
    getParentSuspenseInstance?(targetInstance: any): null | Container;
    commitHydratedContainer?(container: Container): void;
    commitHydratedSuspenseInstance?(suspenseInstance: Container): void;
    didNotMatchHydratedContainerTextInstance?(parentContainer: Container, textInstance: Container, text: string): void;
    didNotMatchHydratedTextInstance?(
        parentType: any,
        parentProps: PropsType,
        parentInstance: Container,
        textInstance: Container,
        text: string,
    ): void;
    didNotHydrateContainerInstance?(parentContainer: Container, instance: Container): void;
    didNotHydrateInstance?(parentType: any, parentProps: PropsType, parentInstance: Container, instance: Container): void;
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

export type StageProps<Application, ApplicationOptions> = {
    children: React.ReactNode;
    width?: number;
    height?: number;
    onMount?: MountUnmountType<Application>;
    onUnmount?: MountUnmountType<Application>;
    raf?: boolean;
    renderOnComponentChange?: boolean;
    options?: ApplicationOptions;
};

export type StageType<BaseStage, Application, ApplicationOptions> = ForwardRefExoticComponent<
PropsWithoutRef<PropsType & StageProps<Application, ApplicationOptions>> & RefAttributes<BaseStage>
>;

export type applyPropsType<P extends PropsType, PixiContainer extends PixiReactMinimalExpandoContainer> = (
    instance: PixiContainer,
    oldProps: Readonly<P>,
    newProps: Readonly<P>,
) => boolean;

// TODO: consider if we want to provide a different type for instance and parent!!
export type didMountType<PixiContainer extends PixiReactMinimalExpandoContainer> = (
    instance: PixiContainer,
    parent: PixiContainer,
) => void;

export type willUnmountType<PixiContainer extends PixiReactMinimalExpandoContainer> = (
    instance: PixiContainer,
    parent: PixiContainer,
) => void;

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
export type createCustomComponentType<P extends PropsType, PixiContainer extends PixiReactMinimalExpandoContainer> = (
    root: PixiContainer,
    props: P,
) => PixiContainer;

export interface ICustomComponent<P extends PropsType, PixiContainer extends PixiReactMinimalExpandoContainer>
{
    /**
     * Create the PIXI instance
     * The component is created during React reconciliation.
     *
     * @param props passed down props
     * @param {PixiContainer} root passed down props
     * @returns {PixiContainer}
     */
    create(props: P, root?: PixiContainer | null): PixiContainer;

    /**
     * Instance mounted
     * This is called during React reconciliation.
     *
     * @param {PixiContainer} instance
     * @param {PixiContainer} parent
     */
    didMount?: didMountType<PixiContainer>;

    /**
     * Instance will unmount
     * This is called during React reconciliation.
     *
     * @param {PixiContainer} instance
     * @param {PixiContainer} parent
     */
    willUnmount?: willUnmountType<PixiContainer>;

    /**
     * Apply props for this custom component.
     * This is called during React reconciliation.
     *
     * @param {PixiContainer} instance
     * @param oldProps
     * @param newProps
     */
    applyProps?: applyPropsType<P, PixiContainer>;

    /**
     * Reconcile config
     */
    config?: lifeCycleConfigType;
}

export type ComponentType<
    P extends PropsType,
    PixiContainer extends PixiReactMinimalExpandoContainer = PixiReactMinimalExpandoContainer,
> = createCustomComponentType<P, PixiContainer> | ICustomComponent<P, PixiContainer>;

export type ComponentsType = Record<string, ComponentType<any, any>>;

export type PixiComponentType<P extends PropsType, ComponentType> = (
    type: string,
    lifecycle: ComponentType,
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
