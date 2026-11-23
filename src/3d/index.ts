import {
    Camera3D,
    Container3D,
    View3D,
} from '@pixi/3d';
import { ReactToPixiEventPropNames } from '../constants/EventPropNames';
import { applyProps } from '../helpers/applyProps';
import { setSceneExtension } from '../helpers/hostChildren';
import { type PixiReactElementProps } from '../typedefs/PixiReactNode';

import type * as PIXI3D from '@pixi/3d';

// The camera each view made for itself; `camera` props configure it
const ownCameras = new WeakMap<View3D, Camera3D>();

// Each view's `camera` props as last applied: only changes apply, and a replacement own camera gets them too
const cameraObjects = new WeakMap<View3D, Record<string, unknown>>();
const cameraDashedProps = new WeakMap<View3D, Record<string, unknown>>();

const warned = new Set<string>();

function warnOnce(message: string)
{
    if (!warned.has(message))
    {
        warned.add(message);
        console.warn(message);
    }
}

function isClass(component: unknown, base: abstract new (...args: any) => unknown)
{
    return component === base || (component as { prototype?: unknown })?.prototype instanceof base;
}

function contains(ancestor: unknown, node: Container3D | null)
{
    for (; node; node = node.parent)
    {
        if (node === ancestor)
        {
            return true;
        }
    }

    return false;
}

// What a view checks of its camera on every render, with `leaving` already gone
function canUse(view: View3D, camera: Camera3D | undefined, leaving?: unknown): camera is Camera3D
{
    if (!camera || camera.destroyed || camera.renderTexture)
    {
        return false;
    }

    // Assigning `view.camera` adds a camera with no parent to the scene
    if (!camera.parent)
    {
        return camera.visible;
    }

    if (camera.view3d !== view || contains(leaving, camera))
    {
        return false;
    }

    for (let node: Container3D | null = camera; node && node !== view.root; node = node.parent)
    {
        if (!node.visible)
        {
            return false;
        }
    }

    return true;
}

function viewOf(node: unknown)
{
    if (node instanceof View3D)
    {
        return node;
    }

    return node instanceof Container3D ? node.view3d : null;
}

// Inline objects such as `position: { x, y, z }` are new on every render, so compare them by value
function same(a: unknown, b: unknown)
{
    if (a === b)
    {
        return true;
    }

    if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b))
    {
        return false;
    }

    const keys = Object.keys(a);

    return keys.length === Object.keys(b).length
        && keys.every((key) => (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key]);
}

function setCameraProp(camera: Camera3D, prop: string, value: unknown)
{
    if (value !== undefined)
    {
        applyProps(camera as any, { [prop]: value });

        return;
    }

    const isEvent = prop in ReactToPixiEventPropNames;

    applyProps(camera as any, {
        changes: [[prop, '__defaultremove', isEvent, !isEvent && prop.includes('-') ? prop.split('-') : []]],
    });
}

// A view throws on render once its camera has left its scene or is hidden, so switch first
function fallBack(view: View3D, leaving?: unknown)
{
    if (view.destroyed)
    {
        return;
    }

    let camera = ownCameras.get(view);

    // The app moved the view's own camera somewhere that's leaving or hidden
    if (!canUse(view, camera, leaving))
    {
        camera = new Camera3D();
        applyProps(camera as any, { ...cameraObjects.get(view), ...cameraDashedProps.get(view) });
        ownCameras.set(view, camera);
    }

    view.camera = camera;
}

function applyCameraProp(view: View3D, key: string, value: unknown)
{
    const own = ownCameras.get(view)!;
    const dashed = cameraDashedProps.get(view) ?? {};

    if (key !== 'camera')
    {
        const prop = key.slice('camera-'.length);

        if (!same(dashed[prop], value))
        {
            const { [prop]: _previous, ...rest } = dashed;

            cameraDashedProps.set(view, value === undefined ? rest : { ...rest, [prop]: value });
            setCameraProp(own, prop, value);
        }

        return;
    }

    if (value instanceof Camera3D)
    {
        warnOnce('@pixi/react: `camera` takes props for the view\'s own camera; to render with another camera, assign `view.camera`.');

        return;
    }

    const previous = cameraObjects.get(view) ?? {};
    const next = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const changed = [...new Set([...Object.keys(previous), ...Object.keys(next)])]
        .filter((prop) => !same(previous[prop], next[prop]));

    cameraObjects.set(view, next);
    changed.forEach((prop) => setCameraProp(own, prop, next[prop]));

    // A dashed prop wins over the object, as it does on any element
    for (const [prop, dashedValue] of Object.entries(dashed))
    {
        if (changed.some((changedProp) => prop === changedProp || prop.startsWith(`${changedProp}-`)))
        {
            setCameraProp(own, prop, dashedValue);
        }
    }
}

setSceneExtension({
    childHost: (parent) => (parent instanceof View3D ? parent.root : undefined),

    nodeCreated(node)
    {
        if (node instanceof View3D)
        {
            ownCameras.set(node, node.camera);
        }
    },

    // The app may have moved `child` into another view
    childRemoving(parent, child)
    {
        for (const view of new Set([viewOf(parent), viewOf(child)]))
        {
            if (view && contains(child, view.camera))
            {
                fallBack(view, child);
            }
        }
    },

    nodeChanged(node, props)
    {
        const view = viewOf(node);

        if (view && view !== node && props.some((prop) => prop === 'visible' || prop === 'renderTexture')
            && contains(node, view.camera) && !canUse(view, view.camera))
        {
            fallBack(view);
        }
    },

    ownProps: (component) => (isClass(component, View3D) ? ['root', 'camera'] : undefined),

    applyOwnProps(node, props)
    {
        if (!(node instanceof View3D))
        {
            return;
        }

        for (const [key, value] of Object.entries(props))
        {
            if (key.startsWith('camera'))
            {
                applyCameraProp(node, key, value);
            }
            else
            {
                const type = (node as { __pixireact?: { type?: string } }).__pixireact?.type ?? 'pixiView3D';

                warnOnce(`@pixi/react: <${type}> ignores the \`root\` prop; declare the scene as its children.`);
            }
        }
    },
});

type Pixi3DType = typeof PIXI3D;

type Pixi3DComponents = {
    [K in keyof Pixi3DType]: Pixi3DType[K] extends new (...args: any) => infer I
        ? I extends PIXI3D.Container3D | PIXI3D.View3D ? K : never
        : never
}[keyof Pixi3DType];

type Pixi3DElementProps<C extends new (...args: any) => any> = C extends new (...args: any) => PIXI3D.View3D
    ? Omit<PixiReactElementProps<C>, 'root' | 'camera'> & {
        /** Props for the view's own camera. */
        camera?: Omit<PixiReactElementProps<typeof PIXI3D.Camera3D>, 'children' | 'key' | 'ref'>;
    }
    : PixiReactElementProps<C>;

/** Elements for `@pixi/3d` classes without the `pixi` prefix, e.g. `<view3D>`; opt in like `UnprefixedPixiElements`. */
export type UnprefixedPixi3DElements = {
    [K in Pixi3DComponents as Uncapitalize<K>]: Pixi3DElementProps<Pixi3DType[K]>;
};

/** Elements for `@pixi/3d` classes, e.g. `<pixiView3D>`. */
export type Pixi3DElements = {
    [K in keyof UnprefixedPixi3DElements as `pixi${Capitalize<K>}`]: UnprefixedPixi3DElements[K];
};

declare module '../typedefs/PixiElements'
{
    interface PixiElements extends Pixi3DElements {}
}
