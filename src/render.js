// Module imports
import { Application } from 'pixi.js';
import { createContext } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants.js';
// Local imports
import { reconciler } from './reconciler.js';

/**
 * Internal Pixi.js state.
 */
const context = createContext(null);

// We store roots here since we can render to multiple canvases
const roots = new Map();

document.querySelector('*');

/**
 * This renders an element to a canvas, creates a renderer, scene, etc.
 *
 * @param {import('react').ReactNode} component The component to be rendered.
 * @param {Element | HTMLCanvasElement} target The target element into which the Pixi application will be rendered. Can be any element, but if a <canvas> is passed the application will be rendered to it directly.
 * @param {object} [props]
 * @param {object} [props.size]
 * @param {number} props.size.height
 * @param {number} props.size.width
 */
export function render(
    component,
    target,
    {
        size,
        ...props
    } = {},
)
{
    let canvas;

    if (target instanceof HTMLCanvasElement)
    {
        canvas = target;
    }

    // Get store and init/update Pixi.js state
    const store = roots.get(target);
    let root = store?.root;
    const state = Object.assign((store?.state ?? {}), {
        ...props,
        size,
    });

    // // If size isn't explicitly defined, we can assume it from the canvas
    // if (!size) {
    // 	size = {
    // 		height: canvas.parentElement?.clientHeight || 0,
    // 		width: canvas.parentElement?.clientWidth || 0,
    // 	}
    // }

    // Get store and init/update Pixi.js state
    // const store = roots.get(canvas)
    // let root = store?.root
    // const state = Object.assign(store?.state || {}, { ...props, size })

    // Initiate root
    if (!root)
    {
        const applicationProps = {};

        if (canvas)
        {
            applicationProps.canvas = canvas;
        }

        if (size)
        {
            applicationProps.height = size.height;
            applicationProps.width = size.width;
        }

        state.app = new Application();
        state.app.init(applicationProps);

        if (!canvas)
        {
            target.innerHTML = '';
            target.appendChild(state.app.canvas);
            canvas = state.app.canvas;
        }

        if (!state.size)
        {
            state.size = {
                height: canvas.parentElement?.clientHeight ?? 0,
                width: canvas.parentElement?.clientWidth ?? 0,
            };
        }

        root = reconciler.createContainer(
            state.app.stage,
            ConcurrentRoot,
            null,
            false,
            null,
            '',
            console.error,
            null,
        );

        // // Keep track of elements subscribed to the render loop with useFrame
        // state.subscribed = []
        // state.subscribe = ref => {
        // 	if (state.subscribed.includes(ref)) {
        // 		state.subscribed = state.subscribed.filter(callback => callback !== ref)
        // 	} else {
        // 		state.subscribed.push(ref)
        // 	}
        // }
    }

    // // Handle resize
    // state.gl.setSize(size.width, size.height)
    // state.camera.aspect = size.width / size.height
    // state.camera.updateProjectionMatrix()

    // Update root
    roots.set(target, { root, state });

    // Update fiber and expose Pixi.js state to children
    reconciler.updateContainer(
        (
            <context.Provider value={state}>
                {component}
            </context.Provider>
        ),
        root,
        null,
        () => undefined
    );

    return state;
}
