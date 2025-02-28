import packageData from '../../package.json' with { type: 'json' };
import { afterActiveInstanceBlur } from '../helpers/afterActiveInstanceBlur';
import { appendChild } from '../helpers/appendChild';
import { beforeActiveInstanceBlur } from '../helpers/beforeActiveInstanceBlur';
import { clearContainer } from '../helpers/clearContainer';
import { commitUpdate } from '../helpers/commitUpdate';
import { createInstance } from '../helpers/createInstance';
import { createReconciler } from '../helpers/createReconciler';
import { createTextInstance } from '../helpers/createTextInstance';
import { detachDeletedInstance } from '../helpers/detachDeletedInstance';
import { finalizeInitialChildren } from '../helpers/finalizeInitialChildren';
import { getChildHostContext } from '../helpers/getChildHostContext';
import { getCurrentUpdatePriority } from '../helpers/getCurrentUpdatePriority';
import { getInstanceFromNode } from '../helpers/getInstanceFromNode';
import { getInstanceFromScope } from '../helpers/getInstanceFromScope';
import { getPublicInstance } from '../helpers/getPublicInstance';
import { getRootHostContext } from '../helpers/getRootHostContext';
import { hideInstance } from '../helpers/hideInstance';
import { hideTextInstance } from '../helpers/hideTextInstance';
import { insertBefore } from '../helpers/insertBefore';
import { maySuspendCommit } from '../helpers/maySuspendCommit';
import { preloadInstance } from '../helpers/preloadInstance';
import { prepareForCommit } from '../helpers/prepareForCommit';
import { preparePortalMount } from '../helpers/preparePortalMount';
import { prepareScopeUpdate } from '../helpers/prepareScopeUpdate';
import { removeChild } from '../helpers/removeChild';
import { requestPostPaintCallback } from '../helpers/requestPostPaintCallback';
import { resetAfterCommit } from '../helpers/resetAfterCommit';
import { resetFormInstance } from '../helpers/resetFormInstance';
import { resolveEventTimeStamp } from '../helpers/resolveEventTimeStamp';
import { resolveEventType } from '../helpers/resolveEventType';
import { resolveUpdatePriority } from '../helpers/resolveUpdatePriority';
import { setCurrentUpdatePriority } from '../helpers/setCurrentUpdatePriority';
import { shouldAttemptEagerTransition } from '../helpers/shouldAttemptEagerTransition';
import { shouldSetTextContent } from '../helpers/shouldSetTextContent';
import { startSuspendingCommit } from '../helpers/startSuspendingCommit';
import { suspendInstance } from '../helpers/suspendInstance';
import { trackSchedulerEvent } from '../helpers/trackSchedulerEvent';
import { unhideInstance } from '../helpers/unhideInstance';
import { unhideTextInstance } from '../helpers/unhideTextInstance';
import { waitForCommitToBeReady } from '../helpers/waitForCommitToBeReady';
import { type HostConfig } from '../typedefs/HostConfig';

const reconcilerConfig = {
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
};

const reconciler = createReconciler<
    HostConfig['type'],
    HostConfig['props'],
    HostConfig['containerInstance'],
    HostConfig['instance'],
    HostConfig['textInstance'],
    HostConfig['suspenseInstance'],
    HostConfig['hydratableInstance'],
    HostConfig['formInstance'],
    HostConfig['publicInstance'],
    HostConfig['hostContext'],
    HostConfig['childSet'],
    HostConfig['timeoutHandle'],
    HostConfig['noTimeout'],
    HostConfig['transitionStatus']
>(reconcilerConfig);

reconciler.injectIntoDevTools({
    bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
    rendererPackageName: '@pixi/react',
    version: packageData.version,
});

export { reconciler };
