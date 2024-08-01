/* eslint-disable no-empty-function */

import Reconciler from 'react-reconciler';
import packageData from '../../package.json' assert { type: 'json' };
import { afterActiveInstanceBlur } from '../helpers/afterActiveInstanceBlur';
import { appendChild } from '../helpers/appendChild';
import { beforeActiveInstanceBlur } from '../helpers/beforeActiveInstanceBlur';
import { clearContainer } from '../helpers/clearContainer';
import { commitUpdate } from '../helpers/commitUpdate';
import { createInstance } from '../helpers/createInstance';
import { createTextInstance } from '../helpers/createTextInstance';
import { detachDeletedInstance } from '../helpers/detachDeletedInstance';
import { finalizeInitialChildren } from '../helpers/finalizeInitialChildren';
import { getChildHostContext } from '../helpers/getChildHostContext';
import { getCurrentEventPriority } from '../helpers/getCurrentEventPriority';
import { getInstanceFromNode } from '../helpers/getInstanceFromNode';
import { getInstanceFromScope } from '../helpers/getInstanceFromScope';
import { getPublicInstance } from '../helpers/getPublicInstance';
import { getRootHostContext } from '../helpers/getRootHostContext';
import { hideInstance } from '../helpers/hideInstance';
import { insertBefore } from '../helpers/insertBefore';
import { prepareForCommit } from '../helpers/prepareForCommit';
import { preparePortalMount } from '../helpers/preparePortalMount';
import { prepareScopeUpdate } from '../helpers/prepareScopeUpdate';
import { prepareUpdate } from '../helpers/prepareUpdate';
import { removeChild } from '../helpers/removeChild';
import { resetAfterCommit } from '../helpers/resetAfterCommit';
import { shouldSetTextContent } from '../helpers/shouldSetTextContent';
import { unhideInstance } from '../helpers/unhideInstance';

import type { HostConfig } from '../typedefs/HostConfig';

const reconcilerConfig: Reconciler.HostConfig<
HostConfig['type'],
HostConfig['props'],
HostConfig['containerInstance'],
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
    version: packageData.version,
});

export { reconciler };
