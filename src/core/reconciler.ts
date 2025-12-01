import { afterActiveInstanceBlur } from "../helpers/afterActiveInstanceBlur";
import { appendChild } from "../helpers/appendChild";
import { beforeActiveInstanceBlur } from "../helpers/beforeActiveInstanceBlur";
import { clearContainer } from "../helpers/clearContainer";
import { commitUpdate } from "../helpers/commitUpdate";
import { createInstance } from "../helpers/createInstance";
import { createReconciler } from "../helpers/createReconciler";
import { createTextInstance } from "../helpers/createTextInstance";
import { detachDeletedInstance } from "../helpers/detachDeletedInstance";
import { finalizeInitialChildren } from "../helpers/finalizeInitialChildren";
import { getChildHostContext } from "../helpers/getChildHostContext";
import { getCurrentUpdatePriority } from "../helpers/getCurrentUpdatePriority";
import { getInstanceFromNode } from "../helpers/getInstanceFromNode";
import { getInstanceFromScope } from "../helpers/getInstanceFromScope";
import { getPublicInstance } from "../helpers/getPublicInstance";
import { getRootHostContext } from "../helpers/getRootHostContext";
import { hideInstance } from "../helpers/hideInstance";
import { hideTextInstance } from "../helpers/hideTextInstance";
import { insertBefore } from "../helpers/insertBefore";
import { maySuspendCommit } from "../helpers/maySuspendCommit";
import { preloadInstance } from "../helpers/preloadInstance";
import { prepareForCommit } from "../helpers/prepareForCommit";
import { preparePortalMount } from "../helpers/preparePortalMount";
import { prepareScopeUpdate } from "../helpers/prepareScopeUpdate";
import { removeChild } from "../helpers/removeChild";
import { requestPostPaintCallback } from "../helpers/requestPostPaintCallback";
import { resetAfterCommit } from "../helpers/resetAfterCommit";
import { resetFormInstance } from "../helpers/resetFormInstance";
import { resolveEventTimeStamp } from "../helpers/resolveEventTimeStamp";
import { resolveEventType } from "../helpers/resolveEventType";
import { resolveUpdatePriority } from "../helpers/resolveUpdatePriority";
import { setCurrentUpdatePriority } from "../helpers/setCurrentUpdatePriority";
import { shouldAttemptEagerTransition } from "../helpers/shouldAttemptEagerTransition";
import { shouldSetTextContent } from "../helpers/shouldSetTextContent";
import { startSuspendingCommit } from "../helpers/startSuspendingCommit";
import { suspendInstance } from "../helpers/suspendInstance";
import { trackSchedulerEvent } from "../helpers/trackSchedulerEvent";
import { unhideInstance } from "../helpers/unhideInstance";
import { unhideTextInstance } from "../helpers/unhideTextInstance";
import { waitForCommitToBeReady } from "../helpers/waitForCommitToBeReady";
import { type HostConfig } from "../typedefs/HostConfig";

const reconciler = /* @__PURE__ */ createReconciler<
    HostConfig["type"],
    HostConfig["props"],
    HostConfig["containerInstance"],
    HostConfig["instance"],
    HostConfig["textInstance"],
    HostConfig["suspenseInstance"],
    HostConfig["hydratableInstance"],
    HostConfig["formInstance"],
    HostConfig["publicInstance"],
    HostConfig["hostContext"],
    HostConfig["childSet"],
    HostConfig["timeoutHandle"],
    HostConfig["noTimeout"],
    HostConfig["transitionStatus"]
>({
    isPrimaryRenderer: false,
    noTimeout: -1,
    NotPendingTransition: null,
    supportsHydration: false,
    supportsMutation: true,
    supportsPersistence: false,
    warnsIfNotActing: false,

    afterActiveInstanceBlur,
    appendChild,
    appendChildToContainer: appendChild,
    appendInitialChild: appendChild,
    beforeActiveInstanceBlur,
    cancelTimeout: clearTimeout,
    clearContainer,
    commitUpdate,
    createInstance,
    createTextInstance,
    hideTextInstance,
    unhideTextInstance,
    detachDeletedInstance,
    finalizeInitialChildren,
    getChildHostContext,
    getCurrentUpdatePriority,
    getInstanceFromNode,
    getInstanceFromScope,
    getPublicInstance,
    getRootHostContext,
    hideInstance,
    insertBefore,
    insertInContainerBefore: insertBefore,
    maySuspendCommit,
    preloadInstance,
    prepareForCommit,
    preparePortalMount,
    prepareScopeUpdate,
    removeChild,
    removeChildFromContainer: removeChild,
    requestPostPaintCallback,
    resetAfterCommit,
    resetFormInstance,
    resolveEventTimeStamp,
    resolveEventType,
    resolveUpdatePriority,
    scheduleTimeout: setTimeout,
    shouldAttemptEagerTransition,
    setCurrentUpdatePriority,
    shouldSetTextContent,
    startSuspendingCommit,
    suspendInstance,
    trackSchedulerEvent,
    unhideInstance,
    waitForCommitToBeReady,

    // @ts-expect-error untyped 19.x features
    // https://github.com/facebook/react/pull/31975
    // https://github.com/facebook/react/pull/31999
    applyViewTransitionName(_instance: any, _name: any, _className: any) {},
    restoreViewTransitionName(_instance: any, _props: any) {},
    cancelViewTransitionName(_instance: any, _name: any, _props: any) {},
    cancelRootViewTransitionName(_rootContainer: any) {},
    restoreRootViewTransitionName(_rootContainer: any) {},
    InstanceMeasurement: null,
    measureInstance: (_instance: any) => null,
    wasInstanceInViewport: (_measurement: any): boolean => true,
    hasInstanceChanged: (_oldMeasurement: any, _newMeasurement: any): boolean =>
        false,
    hasInstanceAffectedParent: (
        _oldMeasurement: any,
        _newMeasurement: any
    ): boolean => false,
    // https://github.com/facebook/react/pull/32002
    // https://github.com/facebook/react/pull/34486
    suspendOnActiveViewTransition(_state: any, _container: any) {},
    // https://github.com/facebook/react/pull/32451
    // https://github.com/facebook/react/pull/32760
    startGestureTransition: () => null,
    startViewTransition: () => null,
    stopViewTransition(_transition: null) {},
    // https://github.com/facebook/react/pull/32038
    createViewTransitionInstance: (_name: string): null => null,
    // https://github.com/facebook/react/pull/32379
    // https://github.com/facebook/react/pull/32786
    getCurrentGestureOffset(_provider: null): number {
        throw new Error(
            "startGestureTransition is not yet supported in React Pixi."
        );
    },
    // https://github.com/facebook/react/pull/32500
    cloneMutableInstance(instance: any, _keepChildren: any) {
        return instance;
    },
    cloneMutableTextInstance(textInstance: any) {
        return textInstance;
    },
    cloneRootViewTransitionContainer(_rootContainer: any) {
        throw new Error("Not implemented.");
    },
    removeRootViewTransitionClone(_rootContainer: any, _clone: any) {
        throw new Error("Not implemented.");
    },
    // https://github.com/facebook/react/pull/32465
    createFragmentInstance: (_fiber: any): null => null,
    updateFragmentInstanceFiber(_fiber: any, _instance: any): void {},
    commitNewChildToFragmentInstance(
        _child: any,
        _fragmentInstance: any
    ): void {},
    deleteChildFromFragmentInstance(
        _child: any,
        _fragmentInstance: any
    ): void {},
    // https://github.com/facebook/react/pull/32653
    measureClonedInstance: (_instance: any) => null,
    // https://github.com/facebook/react/pull/32819
    maySuspendCommitOnUpdate: (_type: any, _oldProps: any, _newProps: any) =>
        false,
    maySuspendCommitInSyncRender: (_type: any, _props: any) => false,
    // https://github.com/facebook/react/pull/34522
    getSuspendedCommitReason: (_state: any, _rootContainer: any) => null,
});

export { reconciler };
