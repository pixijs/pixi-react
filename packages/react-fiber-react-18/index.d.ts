import * as React from 'react';

// Reconciler API
interface Reconciler<Instance, TextInstance, Container, PublicInstance>
{
    updateContainerAtExpirationTime(
        element: any,
        container: any,
        parentComponent: React.Component<any, any> | null | undefined,
        expirationTime: any,
        callback: () => void | null | undefined
    ): any;
    createContainer(containerInfo: any, isConcurrent: boolean, hydrate: boolean): any;
    updateContainer(
        element: any,
        container: any,
        parentComponent: React.Component<any, any> | null | undefined,
        callback: () => void | null | undefined
    ): any;
    flushRoot(root: any, expirationTime: any): void;
    requestWork(root: any, expirationTime: any): void;
    computeUniqueAsyncExpiration(): any;
    batchedUpdates<A>(fn: () => A): A;
    unbatchedUpdates<A>(fn: () => A): A;
    deferredUpdates<A>(fn: () => A): A;
    syncUpdates<A>(fn: () => A): A;
    interactiveUpdates<A>(fn: () => A): A;
    flushInteractiveUpdates(): void;
    flushControlled(fn: () => any): void;
    flushSync<A>(fn: () => A): A;
    getPublicRootInstance(container: any): React.Component<any, any> | PublicInstance | null;
    findHostInstance(component: object): PublicInstance | null;
    findHostInstanceWithNoPortals(component: any): PublicInstance | null;
    injectIntoDevTools(devToolsConfig: any): boolean;
}

interface ReconcilerConfig
{
    getRootHostContext(rootContainerInstance: any): any;
    getChildHostContext(): any;
    getChildHostContextForEventComponent(parentHostContext: any): any;
    getPublicInstance(getPublicInstance: any): any;
    prepareForCommit(): void;
    resetAfterCommit(): void;
    createInstance(...args: any[]): any;
    hideInstance(ins: any): void;
    unhideInstance(ins: any, props: any): void;
    appendInitialChild(...args: any[]): any;
    finalizeInitialChildren(doFinalize: boolean): boolean;
    prepareUpdate(...args: any): any;
    shouldSetTextContent(type: any, props: any): boolean;
    shouldDeprioritizeSubtree(type: any, props: any): boolean;
    createTextInstance(): void;
    mountEventComponent(): void;
    updateEventComponent(): void;
    handleEventTarget(): void;
    scheduleTimeout(...args: any[]): any;
    cancelTimeout(...args: any[]): any;
    appendChild(...args: any[]): any;
    appendChildToContainer(...args: any[]): any;
    removeChild(...args: any[]): any;
    removeChildFromContainer(...args: any[]): any;
    insertBefore(...args: any[]): any;
    insertInContainerBefore(...args: any[]): any;
    commitUpdate(...args: any[]): any;
    commitMount(...args: any[]): any;
    commitTextUpdate(...args: any[]): any;
    resetTextContent(...args: any[]): any;
}

// fiber
type PixiFiber = (
    eventsMap?: { [P in keyof ReconcilerConfig]: (...args: any) => void }
) => Reconciler<any, any, any, any>;

// TODO: Where's the best place to define shared module types:
// We don't really want this library to know anything about PIXI
// TODO: should be real React props
type PropsType = Record<string, any>;

type CustomComponentType = {
    // all any should return DisplayObject
    create: (props: PropsType) => any,
    didMount: (instance: any, parent: any) => void,
    willUnmount: (instance: any, parent: any) => void,
    applyProps: (instance: any, oldProps: PropsType, newProps: PropsType) => void,
    config: {
        destroy: boolean,
        destroyChildren: boolean,
        destroyTexture: boolean,
        destroyBaseTexture: boolean,
    },
}

type applyDefaultPropsType = (instance: any, oldProps: PropsType, newProps: PropsType) => void;
type diffPropertiesType = (instance: any, type: string, lastProps: PropsType, nextProps: PropsType) => Array<any> | null;
type configurePixiReactFiberType = (
    options: {
        TYPES: Record<string, CustomComponentType>,
        applyDefaultProps: applyDefaultPropsType,
        diffProperties: diffPropertiesType
    }
) => PixiFiber;

export const configurePixiReactFiber: configurePixiReactFiberType;
