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
import { ContinuousEventPriority, DiscreteEventPriority, DefaultEventPriority } from 'react-reconciler/constants';
import type {
    applyPropsType,
    ComponentType,
    MinimalContainer,
    PropsType,
    PixiReactMinimalExpandoContainer,
    ICustomComponent,
    createCustomComponentType,
    UpdatePayload,
} from '@pixi/react-types';
import { diffProperties as defaultDiffProperties } from './diffProperties';
import type { diffPropertiesType, PixiReactHostConfig } from './types';

const NO_CONTEXT = {};

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

function throwNotYetImplemented()
{
    throw new Error('Not yet implemented.');
}

function getRootHostContext()
{
    return NO_CONTEXT;
}

function getChildHostContext(parentHostContext: any)
{
    return parentHostContext;
}

function getPublicInstance<PixiContainer extends PixiReactMinimalExpandoContainer>(instance: PixiContainer)
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

function hideInstance<PixiContainer extends MinimalContainer>(instance: PixiContainer): void
{
    instance.visible = false;
}

function unhideInstance<PixiContainer extends MinimalContainer>(instance: PixiContainer, props: PropsType): void
{
    const visible = props !== undefined && props !== null && props.hasOwnProperty('visible') ? props.visible : true;

    instance.visible = visible;
}

function finalizeInitialChildren()
{
    return false;
}

function shouldSetTextContent()
{
    return false;
}

function createTextInstance(text: string)
{
    invariant(
        false,
        `pixi-react: Error trying to add text node "${text}"`,
        'PixiFiber does not support text nodes as children of a Pixi component. '
            + 'To pass a string value to your component, use a property other than children. '
            + 'If you wish to display some text, you can use &lt;Text text={string} /&gt; instead.',
    );
}

/**
 * -------------------------------------------
 * Mutation
 * -------------------------------------------
 */

function doAppendChild<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
)
{
    if (parent.addChild)
    {
        parent.addChild(child);
        child.didMount?.(child, parent);
    }
}

function willUnmountRecursive<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    child: ExpandoContainer,
    parent: ExpandoContainer,
)
{
    child.willUnmount?.(child, parent);

    // ensure willUnmount is called on children, but don't actually destroy them
    if (child.config?.destroyChildren !== false && child.children?.length)
    {
        [...child.children].forEach((c) =>
        {
            // TODO: should we call willUnmount anyway irrespective of whether destroyChildren is true?
            // It's ok if c isn't an ExpandoContainer, willUnmountRecursive just won't do anything. It means any children
            // of c won't have this called, is it possible that MinimalContainers can have ExpandoContainer children?
            willUnmountRecursive(c as ExpandoContainer, child);
        });
    }
}

function doRemoveChild<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
)
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

function appendInitialChild<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
)
{
    const res = doAppendChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendInitialChild',
    });

    return res;
}

function appendChild<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
)
{
    const res = doAppendChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendChild',
    });

    return res;
}

function appendChildToContainer<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
)
{
    // TODO: is this intentionally calling appendChild (not doAppendChild)? It will emit two events
    const res = appendChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendChildToContainer',
    });

    return res;
}

function removeChild<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
)
{
    const res = doRemoveChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'removeChild',
    });

    return res;
}

function removeChildFromContainer<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    container: ExpandoContainer,
    child: ExpandoContainer,
)
{
    // TODO: is this intentionally calling removeChild (not doRemoveChild)? It will emit two events
    const res = removeChild(container, child);

    container.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'removeChildFromContainer',
    });

    return res;
}

function insertBefore<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    parent: ExpandoContainer,
    child: ExpandoContainer,
    beforeChild: ExpandoContainer,
)
{
    invariant(child !== beforeChild, 'pixi-react: PixiFiber cannot insert node before itself');

    const childExists = parent.children.indexOf(child) !== -1;
    const index = parent.getChildIndex(beforeChild);

    childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index);
}

function insertInContainerBefore<ExpandoContainer extends PixiReactMinimalExpandoContainer>(
    container: ExpandoContainer,
    child: ExpandoContainer,
    beforeChild: ExpandoContainer,
)
{
    const res = insertBefore(container, child, beforeChild);

    container.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'insertInContainerBefore',
    });

    return res;
}

function clearContainer()
{
    // TODO implement this
}

export function makeHostConfig<ExpandoContainer extends PixiReactMinimalExpandoContainer>({
    COMPONENTS,
    applyDefaultProps,
    diffProperties = defaultDiffProperties,
}: {
    COMPONENTS: Record<string, ComponentType<PropsType, ExpandoContainer>>;
    applyDefaultProps: applyPropsType<PropsType, ExpandoContainer>;
    diffProperties?: diffPropertiesType<ExpandoContainer>;
}): PixiReactHostConfig<ExpandoContainer>
{
    let prepareChanged: UpdatePayload = null;

    function prepareUpdate(pixiElement: ExpandoContainer, type: string, oldProps: PropsType, newProps: PropsType)
    {
        prepareChanged = diffProperties(pixiElement, type, oldProps, newProps);

        return prepareChanged;
    }

    function commitUpdate(
        instance: ExpandoContainer,
        _updatePayload: UpdatePayload,
        _type: string,
        oldProps: PropsType,
        newProps: PropsType,
    )
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
    function createElement(type: string, props: PropsType, root: ExpandoContainer): ExpandoContainer
    {
        let instance;
        let applyProps;

        const componentLifecycle = COMPONENTS[type];

        if (componentLifecycle)
        {
            const customComponentLifecycle = componentLifecycle as ICustomComponent<PropsType, ExpandoContainer>;

            // Without a significant overhaul we need to continue to support the existing default component API,
            // since in some cases it relies on closures to maintain instance state
            if (!customComponentLifecycle.create)
            {
                instance = (componentLifecycle as createCustomComponentType<PropsType, ExpandoContainer>)(root, props);
            }
            else
            {
                instance = customComponentLifecycle.create(props, root);
                instance.didMount = customComponentLifecycle.didMount
                    ? customComponentLifecycle.didMount.bind(instance)
                    : undefined;
                instance.willUnmount = customComponentLifecycle.willUnmount
                    ? customComponentLifecycle.willUnmount.bind(instance)
                    : undefined;
                instance.applyProps = customComponentLifecycle.applyProps
                    ? customComponentLifecycle.applyProps.bind(instance)
                    : undefined;
                instance.config = customComponentLifecycle.config;
            }
        }

        // apply initial props!
        if (instance)
        {
            instance.__reactpixi = {
                root,
            };

            applyProps = typeof instance?.applyProps === 'function' ? instance.applyProps : applyDefaultProps;
            applyProps(instance, {}, props);
        }
        else
        {
            throw new Error(`Unable to instantiate element of type ${type}`);
        }

        return instance;
    }

    return {
        getRootHostContext,
        getChildHostContext,
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
        createTextInstance,
        // sig: unhideTextInstance(textInstance, text)
        unhideTextInstance: noop,
        // mountEventComponent: noop,
        // updateEventComponent: noop,
        // handleEventTarget: noop,
        scheduleTimeout: setTimeout,
        cancelTimeout: clearTimeout,
        noTimeout: -1,
        warnsIfNotActing: false,
        // now: performanceNow,
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
        // sig: getInstanceFromNode(node)
        getInstanceFromNode: () =>
        {
            throwNotYetImplemented();

            return null;
        },
        // sig: prepareScopeUpdate(scopeInstance: any, instance: any): void;
        prepareScopeUpdate: throwNotYetImplemented,
        // sig: getInstanceFromScope(scopeInstance: any): null | Instance;
        getInstanceFromScope: () =>
        {
            throwNotYetImplemented();

            return null;
        },
        // sig: beforeActiveInstanceBlur(internalInstanceHandle)
        beforeActiveInstanceBlur: noop,
        afterActiveInstanceBlur: noop,
        detachDeletedInstance: noop,
        // sig: preparePortalMount(portalInstance)
        preparePortalMount: noop,
    };
}
