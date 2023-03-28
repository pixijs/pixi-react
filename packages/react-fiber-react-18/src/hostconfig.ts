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
    PropsType,
    PixiReactMinimalExpandoContainer,
    ICustomComponent,
    createCustomComponentType,
    UpdatePayload,
    InstanceProps,
    AttachType,
    LocalState,
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

function hideInstance<Container extends PixiReactMinimalExpandoContainer>(instance: Container): void
{
    // detach while instance is hidden
    const { attach: type, parent } = instance.__reactpixi ?? {};

    if (type && parent)
    {
        detach(parent, instance, type);
    }

    instance.visible = false;
}

function unhideInstance<Container extends PixiReactMinimalExpandoContainer>(instance: Container, props: PropsType): void
{
    // re-attach when the instance is unhidden
    const { attach: type, parent } = instance.__reactpixi ?? {};

    if (type && parent)
    {
        attach(parent, instance, type);
    }

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
export function prepareReactPixiState<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(object: Instance, state?: Partial<LocalState<Container, Instance>>)
{
    object.__reactpixi = {
        root: null,
        previousAttach: null,
        parent: null,
        attachedObjects: [],
        ...state,
    };

    return object;
}

function attach<Container extends PixiReactMinimalExpandoContainer, Instance extends PixiReactMinimalExpandoContainer>(
    parent: Container,
    child: Instance,
    type: AttachType<Container, Instance>,
)
{
    if (typeof type === 'string')
    {
        // @ts-ignore - allow string access for attach property
        child.__reactpixi.previousAttach = parent[type];
        // @ts-ignore - allow string access for attach property
        parent[type] = child;
    }
    else
    {
        child.__reactpixi!.previousAttach = type(parent, child);
    }
}

function detach<Container extends PixiReactMinimalExpandoContainer, Instance extends PixiReactMinimalExpandoContainer>(
    parent: Container,
    child: Instance,
    type: AttachType<Container, Instance>,
)
{
    if (typeof type === 'string')
    {
        const previous = child.__reactpixi!.previousAttach;

        if (previous === undefined)
        {
            // When the previous value was undefined, it means the value was never set to begin with
            // @ts-ignore - allow string access for attach property
            delete parent[type];
        }
        else
        {
            // Otherwise set the previous value
            // @ts-ignore - allow string access for attach property
            parent[type] = previous;
        }
    }
    else
    {
        child.__reactpixi?.previousAttach?.(parent, child);
    }
    delete child.__reactpixi?.previousAttach;
}

// Borrow the attach pattern from react-three-fiber:
// https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/renderer.ts#L136
function doAppendChild<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(parent: Container, child: Instance)
{
    let added = false;

    if (child.__reactpixi?.attach)
    {
        attach(parent, child, child.__reactpixi.attach);
        // make sure to call custom component didMount method for attach as well as direct mounting
        child.didMount?.(child, parent);
    }
    else if (parent.addChild)
    {
        parent.addChild(child);
        child.didMount?.(child, parent);
        added = true;
    }

    // This is for anything that used attach, ie. anything that's a child in React but not necessarily a child in the
    // scenegraph - it could be part of the scenegraph but that's deferred to the instance receiving the attached object
    // it won't be automatically added to the PIXI scenegraph via addChild
    if (!added)
    {
        parent.__reactpixi!.attachedObjects.push(child);
    }
    if (!child.__reactpixi)
    {
        // TODO: Do we need this!?
        prepareReactPixiState(child, {});
    }

    child.__reactpixi!.parent = parent;
}

function willUnmountRecursive<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(child: Instance, parent: Container)
{
    child.willUnmount?.(child, parent);

    // ensure willUnmount is called on children, but don't actually destroy them
    if (child.config?.destroyChildren !== false && child.children?.length)
    {
        // Make sure to include any attachedObjects which aren't necessarily direct children
        // TODO: should we ensure that willUnmount won't get called on the same element twice?
        const unmountingChildren = [...child.children, ...(child.__reactpixi?.attachedObjects || [])];

        unmountingChildren.forEach((c) =>
        {
            // TODO: should we call willUnmount anyway irrespective of whether destroyChildren is true?
            // It's ok if c isn't an Container, willUnmountRecursive just won't do anything. It means any children
            // of c won't have this called, is it possible that MinimalContainers can have Container children?
            willUnmountRecursive(c as Container, child);
        });
    }
}

function doRemoveChild<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(parent: Container, child: Instance)
{
    if (!child)
    {
        return;
    }

    // call willUnmount on child and iteratively on its descendants
    willUnmountRecursive(child, parent);

    if (child.__reactpixi)
    {
        child.__reactpixi.parent = null;
    }
    if (parent.__reactpixi?.attachedObjects)
    {
        parent.__reactpixi.attachedObjects = parent.__reactpixi.attachedObjects.filter((x) => x !== child);
    }
    if (child.__reactpixi?.attach)
    {
        detach(parent, child, child.__reactpixi.attach);
    }
    else
    {
        parent.removeChild(child);
    }

    if (child.__reactpixi)
    {
        delete child.__reactpixi.root;
        delete (child.__reactpixi as Partial<LocalState<any, any>>).attachedObjects;
    }

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

function appendInitialChild<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(parent: Container, child: Instance)
{
    const res = doAppendChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendInitialChild',
    });

    return res;
}

function appendChild<Container extends PixiReactMinimalExpandoContainer, Instance extends PixiReactMinimalExpandoContainer>(
    parent: Container,
    child: Instance,
)
{
    const res = doAppendChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendChild',
    });

    return res;
}

function appendChildToContainer<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(parent: Container, child: Instance)
{
    // TODO: is this intentionally calling appendChild (not doAppendChild)? It will emit two events
    const res = appendChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'appendChildToContainer',
    });

    return res;
}

function removeChild<Container extends PixiReactMinimalExpandoContainer, Instance extends PixiReactMinimalExpandoContainer>(
    parent: Container,
    child: Instance,
)
{
    const res = doRemoveChild(parent, child);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'removeChild',
    });

    return res;
}

function removeChildFromContainer<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>(container: Container, child: Instance)
{
    // TODO: is this intentionally calling removeChild (not doRemoveChild)? It will emit two events
    const res = removeChild(container, child);

    container.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, {
        detail: 'removeChildFromContainer',
    });

    return res;
}

function insertBefore<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
    SiblingInstance extends PixiReactMinimalExpandoContainer,
>(parent: Container, child: Instance, beforeChild: Instance | SiblingInstance)
{
    invariant(child !== beforeChild, 'pixi-react: PixiFiber cannot insert node before itself');

    if (!child)
    {
        return;
    }

    let added = false;

    if (child.__reactpixi?.attach)
    {
        attach(parent, child, child.__reactpixi.attach);
    }
    else
    {
        const childExists = parent.children.indexOf(child) !== -1;
        const index = parent.getChildIndex(beforeChild);

        childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index);

        added = true;
    }

    if (!added)
    {
        parent.__reactpixi?.attachedObjects.push(child);
    }
    if (!child.__reactpixi)
    {
        // TODO: not sure we need this!?
        prepareReactPixiState(child, {});
    }

    child.__reactpixi!.parent = parent;
}

function insertInContainerBefore<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
    SiblingInstance extends PixiReactMinimalExpandoContainer,
>(container: Container, child: Instance, beforeChild: Instance | SiblingInstance)
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

export function makeHostConfig<
    Container extends PixiReactMinimalExpandoContainer,
    Instance extends PixiReactMinimalExpandoContainer,
>({
    COMPONENTS,
    applyDefaultProps,
    diffProperties = defaultDiffProperties,
}: {
    COMPONENTS: Record<string, ComponentType<PropsType, Container, Instance>>;
    applyDefaultProps: applyPropsType<PropsType, Instance>;
    diffProperties?: diffPropertiesType<Instance>;
}): PixiReactHostConfig<Container, Instance>
{
    let prepareChanged: UpdatePayload = null;

    function prepareUpdate(pixiElement: Instance, type: string, oldProps: PropsType, newProps: PropsType)
    {
        prepareChanged = diffProperties(pixiElement, type, oldProps, newProps);

        return prepareChanged;
    }

    function commitUpdate(
        instance: Instance,
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
    function createElement(type: string, props: InstanceProps<Container, Instance>, root: Container): Instance
    {
        const { attach, ...restProps } = props;
        let instance;
        let applyProps;

        const componentLifecycle = COMPONENTS[type];

        if (componentLifecycle)
        {
            const customComponentLifecycle = componentLifecycle as ICustomComponent<PropsType, Container, Instance>;

            // Without a significant overhaul we need to continue to support the existing default component API,
            // since in some cases it relies on closures to maintain instance state
            if (!customComponentLifecycle.create)
            {
                instance = (componentLifecycle as createCustomComponentType<PropsType, Container, Instance>)(
                    root,
                    restProps,
                );
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
            prepareReactPixiState(instance, { attach, root });

            applyProps = typeof instance?.applyProps === 'function' ? instance.applyProps : applyDefaultProps;
            applyProps(instance, {}, restProps);
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
