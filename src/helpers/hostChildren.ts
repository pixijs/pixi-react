import {
    Container,
    Filter,
} from 'pixi.js';
import { attach } from './attach';
import { detach } from './detach';

interface SceneNode
{
    parent: unknown;
    children: unknown[];
    addChild(child: unknown): unknown;
    addChildAt(child: unknown, index: number): unknown;
    getChildIndex(child: unknown): number;
    removeChild(child: unknown): unknown;
}

const FILTERS = 'filters';

type Placement = typeof FILTERS | SceneNode | null;

// Children in React order: a filter's next React sibling may be a node, and the other way round
const reactChildren = new WeakMap<object, unknown[]>();

const trackedParents = new WeakMap<object, object>();

const warned = new Set<string>();

function describe(instance: any)
{
    return instance?.__pixireact?.type || instance?.constructor?.name || typeof instance;
}

function isSceneNode(value: any): value is SceneNode
{
    return typeof value?.addChild === 'function'
        && typeof value.addChildAt === 'function'
        && typeof value.getChildIndex === 'function'
        && typeof value.removeChild === 'function';
}

function getPlacement(parent: any, child: any): Placement
{
    if (child instanceof Filter)
    {
        return parent instanceof Container ? FILTERS : null;
    }

    // pixi.js nodes only nest in pixi.js nodes
    if (isSceneNode(child) && isSceneNode(parent) && (child instanceof Container) === (parent instanceof Container))
    {
        return parent;
    }

    return null;
}

function findPlacement(parent: any, child: any): Placement
{
    const placement = getPlacement(parent, child);

    if (!placement)
    {
        const message = `@pixi/react: can't place <${describe(child)}> under <${describe(parent)}>, so it won't be rendered. `
            + 'pixi.js nodes nest in pixi.js nodes.';

        if (!warned.has(message))
        {
            warned.add(message);
            console.warn(message);
        }
    }

    return placement;
}

function getReactChildren(parent: object)
{
    let list = reactChildren.get(parent);

    if (!list)
    {
        list = [];
        reactChildren.set(parent, list);
    }

    return list;
}

function untrack(child: object)
{
    const parent = trackedParents.get(child);

    if (!parent)
    {
        return;
    }

    const list = reactChildren.get(parent);
    const index = list ? list.indexOf(child) : -1;

    if (index !== -1)
    {
        list!.splice(index, 1);
    }

    trackedParents.delete(child);
}

function append(parent: any, child: any, placement: Placement)
{
    if (placement === FILTERS)
    {
        // React also appends to move a filter to the end
        detach(child);
        attach(parent, child);
    }
    else if (placement)
    {
        // Moves an existing child to the end
        placement.addChild(child);
    }
}

function insert(parent: any, child: any, beforeChild: any, placement: Placement)
{
    if (placement === FILTERS)
    {
        detach(child);

        // After detaching, so the index is current
        const targetIndex = parent.__pixireact.filters.indexOf(beforeChild);

        attach(parent, child, targetIndex === -1 ? undefined : targetIndex);
    }
    else if (placement)
    {
        // Before pixi.js 8.20, moving a child with `addChildAt` registers its `onRender` twice
        if (child.parent === placement)
        {
            placement.removeChild(child);
        }

        placement.addChildAt(child, placement.getChildIndex(beforeChild));
    }
}

export function appendHostChild(parent: any, child: any)
{
    untrack(child);
    getReactChildren(parent).push(child);
    trackedParents.set(child, parent);

    append(parent, child, findPlacement(parent, child));
}

export function insertHostChild(parent: any, child: any, beforeChild: any)
{
    untrack(child);

    const list = getReactChildren(parent);
    const beforeIndex = list.indexOf(beforeChild);
    const placement = findPlacement(parent, child);

    trackedParents.set(child, parent);

    if (beforeIndex === -1)
    {
        // A sibling we never placed: append
        list.push(child);
        append(parent, child, placement);

        return;
    }

    list.splice(beforeIndex, 0, child);

    if (!placement)
    {
        return;
    }

    for (let index = beforeIndex + 1; index < list.length; index++)
    {
        if (getPlacement(parent, list[index]) === placement)
        {
            insert(parent, child, list[index], placement);

            return;
        }
    }

    append(parent, child, placement);
}

export function removeHostChild(parent: any, child: any)
{
    untrack(child);

    const placement = getPlacement(parent, child);

    if (placement === FILTERS)
    {
        detach(child);
    }
    else if (placement && child.parent === placement)
    {
        placement.removeChild(child);
    }
}
