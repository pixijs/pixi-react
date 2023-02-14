/**
 * -------------------------------------------
 * Host Config file.
 *
 * See:
 *   https://github.com/facebook/react/tree/master/packages/react-reconciler
 *   https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js
 * -------------------------------------------
 */

import { invariant } from '@pixi/react-invariant';
import performanceNow from 'performance-now';
import {
    ContinuousEventPriority,
    DiscreteEventPriority,
    DefaultEventPriority,
} from 'react-reconciler/constants';
import { diffProperties as defaultDiffProperties } from './diffProperties';

const NO_CONTEXT = {};

function noop() {}

function throwNotYetImplemented()
{
    throw new Error('Not yet implemented.');
}

function getRootHostContext()
{
    return NO_CONTEXT;
}

function getChildHostContext(parentHostContext)
{
    return parentHostContext;
}

function getChildHostContextForEventComponent(parentHostContext)
{
    return parentHostContext;
}

function getPublicInstance(instance)
{
    return instance;
}

function getEventPriority()
{
    if (typeof window === 'undefined')
    {
        return DefaultEventPriority;
    }

    const name = window?.event?.type;

    switch (name)
    {
        case 'click':
        case 'contextmenu':
        case 'dblclick':
        case 'pointercancel':
        case 'pointerdown':
        case 'pointerup':
            return DiscreteEventPriority;
        case 'pointermove':
        case 'pointerout':
        case 'pointerover':
        case 'pointerenter':
        case 'pointerleave':
        case 'wheel':
            return ContinuousEventPriority;
        default:
            return DefaultEventPriority;
    }
}

// TODO: Implement a proper version of getCurrentEventPriority
function getCurrentEventPriority()
{
    return getEventPriority();
}

function prepareForCommit()
{
    return null;
}

function hideInstance(instance)
{
    instance.visible = false;
}

function unhideInstance(instance, props)
{
    const visible
        = props !== undefined && props !== null && props.hasOwnProperty('visible')
            ? props.visible
            : true;

    instance.visible = visible;
}

function finalizeInitialChildren(wordElement, type, props)
{
    return false;
}

function shouldSetTextContent(type, props)
{
    return false;
}

function shouldDeprioritizeSubtree(type, props)
{
    const isAlphaVisible
        = typeof props.alpha === 'undefined' || props.alpha > 0;
    const isRenderable
        = typeof props.renderable === 'undefined' || props.renderable === true;
    const isVisible
        = typeof props.visible === 'undefined' || props.visible === true;

    return !(isAlphaVisible && isRenderable && isVisible);
}

function createTextInstance(
    text,
    rootContainerInstance,
    internalInstanceHandler
)
{
    invariant(
        false,
        `pixi-react: Error trying to add text node "${text}"`,
        'PixiFiber does not support text nodes as children of a Pixi component. '
            + 'To pass a string value to your component, use a property other than children. '
            + 'If you wish to display some text, you can use &lt;Text text={string} /&gt; instead.'
    );
}

/**
 * -------------------------------------------
 * Mutation
 * -------------------------------------------
 */

function doAppendChild(parent, child)
{
    if (parent.addChild)
    {
        parent.addChild(child);

        if (typeof child.didMount === 'function')
        {
            child.didMount(child, parent);
        }
    }
}

function willUnmountRecursive(child, parent)
{
    child.willUnmount?.(child, parent);

    // ensure willUnmount is called on children, but don't actually destroy them
    if (child.config?.destroyChildren !== false && child.children?.length)
    {
        [...child.children].forEach((c) =>
        {
            // TODO: should we call willUnmount anyway irrespective of whether destroyChildren is true?
            willUnmountRecursive(c, child);
        });
    }
}

function doRemoveChild(parent, child)
{
    // call willUnmount on child and iteratively on its descendants
    willUnmountRecursive(child, parent);

    parent.removeChild(child);

    const {
        destroy = true,
        destroyChildren = true,
        destroyTexture = false,
        destroyBaseTexture = false,
    } = child.config ?? {};

    if (destroy)
    {
        // defer to PIXI to actually destroy children
        child.destroy({
            children: destroyChildren,
            texture: destroyTexture,
            baseTexture: destroyBaseTexture,
        });
    }
}

function appendInitialChild(...args)
{
    const res = doAppendChild.apply(null, args);

    args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendInitialChild',
    });

    return res;
}

function appendChild(...args)
{
    const res = doAppendChild.apply(null, args);

    args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendChild',
    });

    return res;
}

function appendChildToContainer(...args)
{
    const res = appendChild.apply(null, args);

    args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendChildToContainer',
    });

    return res;
}

function removeChild(...args)
{
    const res = doRemoveChild.apply(null, args);

    args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'removeChild',
    });

    return res;
}

function removeChildFromContainer(...args)
{
    const res = removeChild.apply(null, args);

    args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'removeChildFromContainer',
    });

    return res;
}

function insertBefore(parent, child, beforeChild)
{
    invariant(
        child !== beforeChild,
        'pixi-react: PixiFiber cannot insert node before itself'
    );

    const childExists = parent.children.indexOf(child) !== -1;
    const index = parent.getChildIndex(beforeChild);

    childExists
        ? parent.setChildIndex(child, index)
        : parent.addChildAt(child, index);
}

function insertInContainerBefore(...args)
{
    const res = insertBefore.apply(null, args);

    args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'insertInContainerBefore',
    });

    return res;
}

function clearContainer(container)
{
    // TODO implement this
}

export function makeHostConfig({
    COMPONENTS,
    applyDefaultProps,
    diffProperties = defaultDiffProperties,
})
{
    let prepareChanged = null;

    function commitUpdate(instance, updatePayload, type, oldProps, newProps)
    {
        let applyProps = instance && instance.applyProps;

        if (typeof applyProps !== 'function')
        {
            applyProps = applyDefaultProps;
        }

        const changed = applyProps(instance, oldProps, newProps);

        if (changed || prepareChanged)
        {
            instance.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
                detail: 'commitUpdate',
            });
        }
    }

    /**
     * Create an element based on tag type
     * Similar to react-dom's `React.createElement()`
     *
     * @param {string} type Element type
     * @param {Object} props Component props
     * @param {Object} root Root instance
     */
    function createElement(type, props = {}, root = null)
    {
        let instance;
        let applyProps;

        const componentLifecycle = COMPONENTS[type];

        if (componentLifecycle)
        {
            // Without a significant overhaul we need to continue to support the existing default component API,
            // since in some cases it relies on closures to maintain instance state
            if (!componentLifecycle.create)
            {
                instance = componentLifecycle(root, props);
            }
            else
            {
                instance = componentLifecycle.create(props, root);
                instance.didMount = componentLifecycle.didMount
                    ? componentLifecycle.didMount.bind(instance)
                    : undefined;
                instance.willUnmount = componentLifecycle.willUnmount
                    ? componentLifecycle.willUnmount.bind(instance)
                    : undefined;
                instance.applyProps = componentLifecycle.applyProps
                    ? componentLifecycle.applyProps.bind(instance)
                    : undefined;
                instance.config = componentLifecycle.config;
            }
        }

        // apply initial props!
        if (instance)
        {
            instance.__reactpixi = {
                root,
            };

            applyProps
                = typeof instance?.applyProps === 'function'
                    ? instance.applyProps
                    : applyDefaultProps;
            applyProps(instance, {}, props);
        }

        return instance;
    }

    function prepareUpdate(
        pixiElement,
        type,
        oldProps,
        newProps,
        rootContainerInstance,
        hostContext
    )
    {
        prepareChanged = diffProperties(pixiElement, type, oldProps, newProps);

        return prepareChanged;
    }

    return {
        getRootHostContext,
        getChildHostContext,
        getChildHostContextForEventComponent,
        getPublicInstance,
        getCurrentEventPriority,
        prepareForCommit,
        resetAfterCommit: noop,
        createInstance: createElement,
        hideInstance,
        unhideInstance,
        finalizeInitialChildren,
        prepareUpdate,
        shouldSetTextContent,
        shouldDeprioritizeSubtree,
        createTextInstance,
        // sig: unhideTextInstance(textInstance, text)
        unhideTextInstance: noop,
        mountEventComponent: noop,
        updateEventComponent: noop,
        handleEventTarget: noop,
        scheduleTimeout: setTimeout,
        cancelTimeout: clearTimeout,
        noTimeout: -1,
        warnsIfNotActing: false,
        now: performanceNow,
        isPrimaryRenderer: false,
        supportsMutation: true,
        supportsPersistence: false,
        supportsHydration: false,
        supportsMicrotasks: true,
        scheduleMicrotask: queueMicrotask,
        appendInitialChild,
        appendChild,
        appendChildToContainer,
        removeChild,
        removeChildFromContainer,
        insertBefore,
        insertInContainerBefore,
        commitUpdate,
        // sig: commitMount(instance, updatePayload, type, oldProps, newProps)
        commitMount: noop,
        // sig: commitTextUpdate(textInstance, oldText, newText)
        commitTextUpdate: noop,
        // sig: resetTextContent(pixiElement)
        resetTextContent: noop,
        clearContainer,
        // sig: getFundamentalComponentInstance(fundamentalInstance)
        getFundamentalComponentInstance: throwNotYetImplemented,
        // sig: mountFundamentalComponent(fundamentalInstance)
        mountFundamentalComponent: throwNotYetImplemented,
        // sig: shouldUpdateFundamentalComponent(fundamentalInstance)
        shouldUpdateFundamentalComponent: throwNotYetImplemented,
        // sig: unmountFundamentalComponent(fundamentalInstance)
        unmountFundamentalComponent: throwNotYetImplemented,
        // sig: getInstanceFromNode(node)
        getInstanceFromNode: throwNotYetImplemented,
        // sig: isOpaqueHydratingObject(value)
        isOpaqueHydratingObject: throwNotYetImplemented,
        // sig: makeOpaqueHydratingObject(attemptToReadValue)
        makeOpaqueHydratingObject: throwNotYetImplemented,
        // sig: makeClientIdInDEV(warnOnAccessInDEV)
        makeClientIdInDEV: throwNotYetImplemented,
        // sig: beforeActiveInstanceBlur(internalInstanceHandle)
        beforeActiveInstanceBlur: noop,
        afterActiveInstanceBlur: noop,
        detachDeletedInstance: noop,
        // sig: preparePortalMount(portalInstance)
        preparePortalMount: noop,
    };
}
