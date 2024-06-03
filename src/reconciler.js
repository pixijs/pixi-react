/* eslint-disable no-empty-function */

import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants.js';
import { appendChild } from './helpers/appendChild.js';
import { applyProps } from './helpers/applyProps.js';
import { createInstance } from './helpers/createInstance.js';
import { removeChild } from './helpers/removeChild.js';

/** @typedef {import('./typedefs/HostConfig.js').HostConfig} HostConfig */
/** @typedef {import('./typedefs/Node.js').Node} Node */

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
    createInstance,
    removeChild,
    removeChildFromContainer: removeChild,
    scheduleTimeout: setTimeout,

    afterActiveInstanceBlur() {},
    beforeActiveInstanceBlur() {},
    createTextInstance() {},
    detachDeletedInstance() {},
    getInstanceFromScope() {},
    insertBefore() {},
    preparePortalMount() {},
    prepareScopeUpdate() {},

    clearContainer()
    {
        return false;
    },
    finalizeInitialChildren()
    {
        return false;
    },
    getChildHostContext()
    {
        return null;
    },
    getCurrentEventPriority()
    {
        return DefaultEventPriority;
    },
    getInstanceFromNode()
    {
        return null;
    },
    /**
	 * @template T
	 * @param {T} instance
	 * @returns {T}
	 */
    getPublicInstance(instance)
    {
        return instance;
    },
    getRootHostContext()
    {
        return null;
    },
    prepareForCommit()
    {
        return {};
    },
    prepareUpdate()
    {
        return {};
    },
    resetAfterCommit()
    {
        return {};
    },
    shouldSetTextContent()
    {
        return false;
    },

    /**
	 * @param {Node} instance
	 * @param {*} _updatePayload Unused.
	 * @param {*} _type Unused.
	 * @param {{}} oldProps
	 * @param {{}} newProps
	 */
    commitUpdate(instance, _updatePayload, _type, oldProps, newProps)
    {
        // This is where we mutate Pixi.js objects in the render phase
        instance.busy = true;
        applyProps(instance, newProps, oldProps);
        instance.busy = false;
    },
};

export const reconciler = Reconciler(reconcilerConfig);
