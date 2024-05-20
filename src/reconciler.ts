// Module imports
import * as PIXI from 'pixi.js';
import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
// Local imports
import { appendChild } from './helpers/appendChild';
import { applyProps } from './helpers/applyProps';
import { convertStringToPascalCase } from './helpers/convertStringToPascalCase';
import { removeChild } from './helpers/removeChild';

import type { HostConfig } from 'react-reconciler';

export type Props = Record<string, any>;

/** @type {Reconciler.HostConfig} */
const reconcilerConfig: HostConfig<
string, // Type
Props, // Props
PIXI.Container, // Container
PIXI.Container, // Instance
any, // TextInstance
unknown, // SuspenseInstance
unknown, // HydratableInstance
unknown, // PublicInstance
any, // HostContext
any, // UpdatePayload
any, // ChildSet
number, // TimeoutHandle
number // NoTimeout
> = {
    isPrimaryRenderer: false,
    noTimeout: -1,
    supportsHydration: false,
    supportsMutation: true,
    supportsPersistence: false,

    appendChild,
    appendChildToContainer: appendChild,
    appendInitialChild: appendChild,
    cancelTimeout: clearTimeout,
    removeChild,
    removeChildFromContainer: removeChild,
    scheduleTimeout: setTimeout,

    afterActiveInstanceBlur() { /** */ },
    beforeActiveInstanceBlur() { /** */ },
    createTextInstance() { /** */ },
    detachDeletedInstance() { /** */ },
    getInstanceFromScope() { return null; },
    insertBefore() { /** */ },
    preparePortalMount() { /** */ },
    prepareScopeUpdate() { /** */ },

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
        return {};
    },
    getCurrentEventPriority()
    {
        return DefaultEventPriority;
    },
    getInstanceFromNode(): null
    {
        return null;
    },
    getPublicInstance(instance: PIXI.Container)
    {
        return instance;
    },
    getRootHostContext()
    {
        return {};
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
	 *
	 * @param {*} instance
	 * @param {*} _updatePayload Unused.
	 * @param {*} _type Unused.
	 * @param {*} oldProps
	 * @param {*} newProps
	 */
    commitUpdate(instance, _updatePayload, _type, oldProps, newProps)
    {
        // This is where we mutate Pixi.js objects in the render phase
        instance.busy = true;
        applyProps(instance, newProps, oldProps);
        instance.busy = false;
    },

    /**
	 *
	 * @param {*} type
	 * @param {*} props
	 * @returns
	 */
    createInstance(type: string, props)
    {
        const {
            object,
            args,
            // ...remainingProps
        } = props;

        // Convert lowercase primitive to PascalCase
        const name = convertStringToPascalCase(type);

        // Get class from Pixi.js namespace
        const Target = PIXI[name as 'Container'];

        // Validate Pixi.js elements
        if (type !== 'primitive' && !Target)
        {
            throw Error(`${type} is not a part of the Pixi.js namespace.`);
        }

        // Validate primitives
        if (type === 'primitive' && !object)
        {
            throw Error('"object" must be set when using primitives.');
        }

        // Create instance
        const instance: PIXI.Container = object || (Array.isArray(args) ? new Target(...args) : new Target(args));

        // Set initial props
        applyProps(instance, props, {});

        return instance;
    },
};

export const reconciler = Reconciler(reconcilerConfig);
