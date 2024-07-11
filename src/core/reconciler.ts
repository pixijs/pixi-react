/* eslint-disable no-empty-function */

import Reconciler from 'react-reconciler';
import { version } from '../../package.json' assert { type: 'json' };
import { afterActiveInstanceBlur } from '../helpers/afterActiveInstanceBlur.ts';
import { appendChild } from '../helpers/appendChild.ts';
import { beforeActiveInstanceBlur } from '../helpers/beforeActiveInstanceBlur.ts';
import { clearContainer } from '../helpers/clearContainer.ts';
import { commitUpdate } from '../helpers/commitUpdate.ts';
import { createInstance } from '../helpers/createInstance.ts';
import { createTextInstance } from '../helpers/createTextInstance.ts';
import { detachDeletedInstance } from '../helpers/detachDeletedInstance.ts';
import { finalizeInitialChildren } from '../helpers/finalizeInitialChildren.ts';
import { getChildHostContext } from '../helpers/getChildHostContext.ts';
import { getCurrentEventPriority } from '../helpers/getCurrentEventPriority.ts';
import { getInstanceFromNode } from '../helpers/getInstanceFromNode.ts';
import { getInstanceFromScope } from '../helpers/getInstanceFromScope.ts';
import { getPublicInstance } from '../helpers/getPublicInstance.ts';
import { getRootHostContext } from '../helpers/getRootHostContext.ts';
import { hideInstance } from '../helpers/hideInstance.ts';
import { insertBefore } from '../helpers/insertBefore.ts';
import { prepareForCommit } from '../helpers/prepareForCommit.ts';
import { preparePortalMount } from '../helpers/preparePortalMount.ts';
import { prepareScopeUpdate } from '../helpers/prepareScopeUpdate.ts';
import { prepareUpdate } from '../helpers/prepareUpdate.ts';
import { removeChild } from '../helpers/removeChild.ts';
import { resetAfterCommit } from '../helpers/resetAfterCommit.ts';
import { shouldSetTextContent } from '../helpers/shouldSetTextContent.ts';
import { unhideInstance } from '../helpers/unhideInstance.ts';

import type { HostConfig } from '../typedefs/HostConfig.ts';

const reconcilerConfig: Reconciler.HostConfig<
HostConfig['type'],
HostConfig['props'],
HostConfig['container'],
HostConfig['instance'],
HostConfig['textInstance'],
HostConfig['suspenseInstance'],
HostConfig['hydratableInstance'],
HostConfig['publicInstance'],
HostConfig['hostContext'],
HostConfig['updatePayload'],
HostConfig['childSet'],
HostConfig['timeoutHandle'],
HostConfig['noTimeout']
> = {
    isPrimaryRenderer: false,
    noTimeout: -1,
    supportsHydration: false,
    supportsMutation: true,
    supportsPersistence: false,

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
    detachDeletedInstance,
    finalizeInitialChildren,
    getChildHostContext,
    getCurrentEventPriority,
    getInstanceFromNode,
    getInstanceFromScope,
    getPublicInstance,
    getRootHostContext,
    hideInstance,
    insertBefore,
    insertInContainerBefore: insertBefore,
    prepareForCommit,
    preparePortalMount,
    prepareScopeUpdate,
    prepareUpdate,
    removeChild,
    removeChildFromContainer: removeChild,
    resetAfterCommit,
    scheduleTimeout: setTimeout,
    shouldSetTextContent,
    unhideInstance,
};

const reconciler = Reconciler(reconcilerConfig);

reconciler.injectIntoDevTools({
    bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
    rendererPackageName: '@pixi/react',
    version,
});

export { reconciler };
