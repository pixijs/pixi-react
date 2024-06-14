/* eslint-disable no-empty-function */

import Reconciler from 'react-reconciler';
import { appendChild } from './helpers/appendChild.js';
import { commitUpdate } from './helpers/commitUpdate.js';
import { createInstance } from './helpers/createInstance.js';
import { createTextInstance } from './helpers/createTextInstance.js';
import { getChildHostContext } from './helpers/getChildHostContext.js';
import { getCurrentEventPriority } from './helpers/getCurrentEventPriority.js';
import { getInstanceFromScope } from './helpers/getInstanceFromScope.js';
import { getPublicInstance } from './helpers/getPublicInstance.js';
import { insertBefore } from './helpers/insertBefore.js';
import { prepareUpdate } from './helpers/prepareUpdate.js';
import { removeChild } from './helpers/removeChild.js';

/** @typedef {import('./typedefs/HostConfig.js').HostConfig} HostConfig */
/** @typedef {import('./typedefs/Instance.js').Instance} Instance */

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

    appendChild,
    appendChildToContainer: appendChild,
    appendInitialChild: appendChild,
    cancelTimeout: clearTimeout,
    commitUpdate,
    createInstance,
    createTextInstance,
    getChildHostContext,
    getCurrentEventPriority,
    getInstanceFromScope,
    getPublicInstance,
    insertBefore,
    insertInContainerBefore: insertBefore,
    prepareUpdate,
    removeChild,
    removeChildFromContainer: removeChild,
    scheduleTimeout: setTimeout,

    afterActiveInstanceBlur() {},
    beforeActiveInstanceBlur() {},
    detachDeletedInstance() {},
    preparePortalMount() {},
    prepareScopeUpdate() {},
    resetAfterCommit() {},

    clearContainer()
    {
        return false;
    },
    finalizeInitialChildren()
    {
        return false;
    },
    getInstanceFromNode()
    {
        return null;
    },
    getRootHostContext()
    {
        return null;
    },
    prepareForCommit()
    {
        return null;
    },
    shouldSetTextContent()
    {
        return false;
    },
};

export const reconciler = Reconciler(reconcilerConfig);
