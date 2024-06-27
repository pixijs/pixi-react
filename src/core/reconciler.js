/* eslint-disable no-empty-function */

import Reconciler from 'react-reconciler';
import { afterActiveInstanceBlur } from '../helpers/afterActiveInstanceBlur.js';
import { appendChild } from '../helpers/appendChild.js';
import { beforeActiveInstanceBlur } from '../helpers/beforeActiveInstanceBlur.js';
import { clearContainer } from '../helpers/clearContainer.js';
import { commitUpdate } from '../helpers/commitUpdate.js';
import { createInstance } from '../helpers/createInstance.js';
import { createTextInstance } from '../helpers/createTextInstance.js';
import { detachDeletedInstance } from '../helpers/detachDeletedInstance.js';
import { finalizeInitialChildren } from '../helpers/finalizeInitialChildren.js';
import { getChildHostContext } from '../helpers/getChildHostContext.js';
import { getCurrentEventPriority } from '../helpers/getCurrentEventPriority.js';
import { getInstanceFromNode } from '../helpers/getInstanceFromNode.js';
import { getInstanceFromScope } from '../helpers/getInstanceFromScope.js';
import { getPublicInstance } from '../helpers/getPublicInstance.js';
import { getRootHostContext } from '../helpers/getRootHostContext.js';
import { insertBefore } from '../helpers/insertBefore.js';
import { prepareForCommit } from '../helpers/prepareForCommit.js';
import { preparePortalMount } from '../helpers/preparePortalMount.js';
import { prepareScopeUpdate } from '../helpers/prepareScopeUpdate.js';
import { prepareUpdate } from '../helpers/prepareUpdate.js';
import { removeChild } from '../helpers/removeChild.js';
import { resetAfterCommit } from '../helpers/resetAfterCommit.js';
import { shouldSetTextContent } from '../helpers/shouldSetTextContent.js';

/** @typedef {import('../typedefs/HostConfig.js').HostConfig} HostConfig */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */

/**
 * @type {Reconciler.HostConfig<
 * 	HostConfig['type'],
 * 	HostConfig['props'],
 * 	HostConfig['container'],
 * 	HostConfig['instance'],
 * 	HostConfig['textInstance'],
 * 	HostConfig['suspenseInstance'],
 * 	HostConfig['hydratableInstance'],
 * 	HostConfig['publicInstance'],
 * 	HostConfig['hostContext'],
 * 	HostConfig['updatePayload'],
 * 	HostConfig['childSet'],
 * 	HostConfig['timeoutHandle'],
 * 	HostConfig['noTimeout']
 * >}
 */
const reconcilerConfig = {
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
};

export const reconciler = Reconciler(reconcilerConfig);
