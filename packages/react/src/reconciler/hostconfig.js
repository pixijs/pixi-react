/**
 * -------------------------------------------
 * Host Config file.
 *
 * See:
 *   https://github.com/facebook/react/tree/master/packages/react-reconciler
 *   https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js
 * -------------------------------------------
 */

import performanceNow from 'performance-now';
import { ContinuousEventPriority, DiscreteEventPriority, DefaultEventPriority } from 'react-reconciler/constants';
import invariant from '../utils/invariant';
import { createElement } from '../utils/element';
import { CHILDREN, applyDefaultProps } from '../utils/props';

const NO_CONTEXT = {};

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

function appendChild(parent, child)
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

function removeChild(parent, child)
{
    // call willUnmount on child and iteratively on its descendants
    willUnmountRecursive(child, parent);

    parent.removeChild(child);

    const {
        destroy = true,
        destroyChildren = true,
        destroyTexture = false,
        destroyBaseTexture = false
    } = child.config ?? {};

    if (destroy)
    {
        // defer to PIXI to actually destroy children
        child.destroy({
            children: destroyChildren,
            texture: destroyTexture,
            baseTexture: destroyBaseTexture
        });
    }
}

function insertBefore(parent, child, beforeChild)
{
    invariant(child !== beforeChild, 'Cannot insert node before itself');

    const childExists = parent.children.indexOf(child) !== -1;

    if (childExists)
    {
        parent.removeChild(child);
    }

    const index = parent.getChildIndex(beforeChild);

    parent.addChildAt(child, index);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'insertBefore' });
}

// get diff between 2 objects
// https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
function diffProperties(pixiElement, type, lastProps, nextProps)
{
    let updatePayload = null;

    for (const propKey in lastProps)
    {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] === null)
        {
            continue;
        }
        if (propKey === CHILDREN)
        {
            // Noop. Text children not supported
        }
        else
        {
            // For all other deleted properties we add it to the queue. We use
            // the whitelist in the commit phase instead.
            if (!updatePayload)
            {
                updatePayload = [];
            }
            updatePayload.push(propKey, null);
        }
    }

    for (const propKey in nextProps)
    {
        const nextProp = nextProps[propKey];
        const lastProp = lastProps !== null ? lastProps[propKey] : undefined;

        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp === null && lastProp === null))
        {
            continue;
        }

        if (propKey === CHILDREN)
        {
            // Noop. Text children not supported
        }
        else
        {
            // For any other property we always add it to the queue and then we
            // filter it out using the whitelist during the commit.
            if (!updatePayload)
            {
                updatePayload = [];
            }
            updatePayload.push(propKey, nextProp);
        }
    }

    return updatePayload;
}

let prepareChanged = null;

const HostConfig = {
    getRootHostContext()
    {
        return NO_CONTEXT;
    },

    getChildHostContext(parentHostContext)
    {
        return parentHostContext;
    },

    getChildHostContextForEventComponent(parentHostContext)
    {
        return parentHostContext;
    },

    getPublicInstance(instance)
    {
        return instance;
    },

    // TODO: Implement a proper version of getCurrentEventPriority
    getCurrentEventPriority()
    {
        return getEventPriority();
    },

    prepareForCommit()
    {
    // noop
        return null;
    },

    resetAfterCommit()
    {
    // noop
    },

    createInstance: createElement,

    hideInstance(instance)
    {
        instance.visible = false;
    },

    unhideInstance(instance, props)
    {
        const visible = props !== undefined && props !== null && props.hasOwnProperty('visible') ? props.visible : true;

        instance.visible = visible;
    },

    finalizeInitialChildren(wordElement, type, props)
    {
        return false;
    },

    prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext)
    {
        prepareChanged = diffProperties(pixiElement, type, oldProps, newProps);

        return prepareChanged;
    },

    shouldSetTextContent(type, props)
    {
        return false;
    },

    shouldDeprioritizeSubtree(type, props)
    {
        const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0;
        const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true;
        const isVisible = typeof props.visible === 'undefined' || props.visible === true;

        return !(isAlphaVisible && isRenderable && isVisible);
    },

    createTextInstance(text, rootContainerInstance, internalInstanceHandler)
    {
        invariant(
            false,
            `Error trying to add text node "${text}"`,
            'text strings as children of a Pixi component is not supported. '
        + 'To add some text, use &lt;Text text={string} /&gt;'
        );
    },

    unhideTextInstance(textInstance, text)
    {
    // noop
    },

    mountEventComponent()
    {
    // noop
    },

    updateEventComponent()
    {
    // noop
    },

    handleEventTarget()
    {
    // noop
    },

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

    /**
   * -------------------------------------------
   * Mutation
   * -------------------------------------------
   */

    appendInitialChild(...args)
    {
        const res = appendChild.apply(null, args);

        args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendInitialChild' });

        return res;
    },

    appendChild(...args)
    {
        const res = appendChild.apply(null, args);

        args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendChild' });

        return res;
    },

    appendChildToContainer(...args)
    {
        const res = appendChild.apply(null, args);

        args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendChildToContainer' });

        return res;
    },

    removeChild(...args)
    {
        const res = removeChild.apply(null, args);

        args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'removeChild' });

        return res;
    },

    removeChildFromContainer(...args)
    {
        const res = removeChild.apply(null, args);

        args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'removeChildFromContainer' });

        return res;
    },

    insertBefore,

    insertInContainerBefore(...args)
    {
        const res = insertBefore.apply(null, args);

        args[0].__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'insertInContainerBefore' });

        return res;
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps)
    {
        let applyProps = instance && instance.applyProps;

        if (typeof applyProps !== 'function')
        {
            applyProps = applyDefaultProps;
        }

        const changed = applyProps(instance, oldProps, newProps);

        if (changed || prepareChanged)
        {
            instance.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'commitUpdate' });
        }
    },

    commitMount(instance, updatePayload, type, oldProps, newProps)
    {
    // noop
    },

    commitTextUpdate(textInstance, oldText, newText)
    {
    // noop
    },

    resetTextContent(pixiElement)
    {
    // noop
    },

    clearContainer(container)
    {
    // TODO implement this
    },

    getFundamentalComponentInstance(fundamentalInstance)
    {
        throw new Error('Not yet implemented.');
    },

    mountFundamentalComponent(fundamentalInstance)
    {
        throw new Error('Not yet implemented.');
    },

    shouldUpdateFundamentalComponent(fundamentalInstance)
    {
        throw new Error('Not yet implemented.');
    },

    unmountFundamentalComponent(fundamentalInstance)
    {
        throw new Error('Not yet implemented.');
    },

    getInstanceFromNode(node)
    {
        throw new Error('Not yet implemented.');
    },

    isOpaqueHydratingObject(value)
    {
        throw new Error('Not yet implemented');
    },

    makeOpaqueHydratingObject(attemptToReadValue)
    {
        throw new Error('Not yet implemented.');
    },

    makeClientIdInDEV(warnOnAccessInDEV)
    {
        throw new Error('Not yet implemented');
    },

    beforeActiveInstanceBlur(internalInstanceHandle)
    {
    // noop
    },

    afterActiveInstanceBlur()
    {
    // noop
    },

    detachDeletedInstance()
    {
    // noop
    },

    preparePortalMount(portalInstance)
    {
    // noop
    },
};

export default HostConfig;
