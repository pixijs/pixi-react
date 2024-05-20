// Module imports
import { Application } from 'pixi.js';
import { createContext, type ReactNode } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants.js';
// Local imports
import { reconciler } from './reconciler.js';

/**
 * Internal Pixi.js state.
 */
const context = createContext(null);

// We store roots here since we can render to multiple canvases
const roots = new Map();

type Props = {
    size?: {
        height: number;
        width: number;
    };
    gl?: object;
    camera?: object;
};

/**
 * This renders an element to a canvas, creates a renderer, scene, etc.
 *
 * @param {import('react').ReactNode} element
 * @param {HTMLCanvasElement} canvas
 * @param {object} [props]
 * @param {object} [props.size]
 * @param {number} props.size.height
 * @param {number} props.size.width
 * @param {object} [props.gl]
 * @param {object} [props.camera]
 */
export function render(
    element: ReactNode,
    canvas: HTMLCanvasElement,
    {
        size,
        gl,
        camera,
        ...props
    }: Props = {},
)
{
    // If size isn't explicitly defined, we can assume it from the canvas
    if (!size)
    {
        size = {
            height: canvas.parentElement?.clientHeight || 0,
            width: canvas.parentElement?.clientWidth || 0,
        };
    }

    // Get store and init/update Pixi.js state
    const store = roots.get(canvas);
    let root = store?.root;
    const state = Object.assign(store?.state || {}, { ...props, size });

    // Initiate root
    if (!root)
    {
        state.app = new Application();
        state.app.init({
            canvas,
            height: size.height,
            width: size.width,
        });

        root = reconciler.createContainer(state.app.stage, ConcurrentRoot, null, false, null, '', console.error, null);

        // Keep track of elements subscribed to the render loop with useFrame
        state.subscribed = [];
        state.subscribe = (ref: any) =>
        {
            if (state.subscribed.includes(ref))
            {
                state.subscribed = state.subscribed.filter((callback: any) => callback !== ref);
            }
            else
            {
                state.subscribed.push(ref);
            }
        };
    }

    // Update root
    roots.set(canvas, { root, state });

    // Update fiber and expose Pixi.js state to children
    reconciler.updateContainer(
        (
            <context.Provider value={state}>
                {element}
            </context.Provider>
        ),
        root,
        null,
        () => undefined
    );

    return state;
}
