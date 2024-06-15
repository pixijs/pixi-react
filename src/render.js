import { Application } from 'pixi.js';
import {
    createContext,
    createElement,
} from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants.js';
import { prepareInstance } from './helpers/prepareInstance.js';
import { reconciler } from './reconciler.js';
import { store as globalStore } from './store.js';

/**
 * Internal Pixi.js state.
 */
const context = createContext(null);

// We store roots here since we can render to multiple canvases
const roots = new Map();

/** @typedef {import('pixi.js').ApplicationOptions} ApplicationOptions */
/** @typedef {Partial<import('react').PropsWithChildren<ApplicationOptions>>} RenderProps */

/**
 * This renders an element to a canvas, creates a renderer, scene, etc.
 *
 * @param {import('react').ReactNode} component The component to be rendered.
 * @param {HTMLElement | HTMLCanvasElement} target The target element into which the Pixi application will be rendered. Can be any element, but if a <canvas> is passed the application will be rendered to it directly.
 * @param {RenderProps} [props]
 * @param {object} [options]
 * @param {boolean} [options.enableLogging]
 */
export function render(
    component,
    target,
    props = {},
    options = {},
)
{
    globalStore.debug = Boolean(options.enableLogging);

    const {
        children = null,
        ...componentProps
    } = props;

    let canvas;

    if (target instanceof HTMLCanvasElement)
    {
        canvas = target;
    }

    // Get store and init/update Pixi.js state
    const store = roots.get(target);
    let root = store?.root;
    const state = Object.assign((store?.state ?? {}), componentProps);

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
        /** @type {Partial<ApplicationOptions>} */
        const applicationProps = {};

        if (canvas)
        {
            applicationProps.canvas = canvas;
        }

        state.app = new Application();
        state.app.init(applicationProps);
        state.rootContainer = prepareInstance(state.app.stage);

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
            state.rootContainer,
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

    // Update root
    roots.set(target, { root, state });

    // Update fiber and expose Pixi.js state to children
    reconciler.updateContainer(
        createElement(context.Provider, { value: state }, component),
        root,
        null,
        () => undefined
    );

    return state;
}
