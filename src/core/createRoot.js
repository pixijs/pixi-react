import { Application } from 'pixi.js';
import { createElement } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants.js';
import { ContextProvider } from '../components/Context.js';
import { isReadOnlyProperty } from '../helpers/isReadOnlyProperty.js';
import { log } from '../helpers/log.js';
import { prepareInstance } from '../helpers/prepareInstance.js';
import { reconciler } from './reconciler.js';
import { roots } from './roots.js';

/** @typedef {import('pixi.js').ApplicationOptions} ApplicationOptions */

/** @typedef {import('../typedefs/InternalState.ts').InternalState} InternalState */
/** @typedef {import('../typedefs/Root.ts').Root} Root */

/**
 * Creates a new root for a Pixi React app.
 *
 * @param {HTMLElement | HTMLCanvasElement} target The target element into which the Pixi application will be rendered. Can be any element, but if a <canvas> is passed the application will be rendered to it directly.
 * @param {Partial<InternalState>} [options]
 * @param {(app: Application) => void} [onInit] Callback to be fired when the application finishes initializing.
 * @returns {Root}
 */
export function createRoot(target, options = {}, onInit)
{
    // Check against mistaken use of createRoot
    let root = roots.get(target);

    const state = /** @type {InternalState} */ (Object.assign((root?.state ?? {}), options));

    if (root)
    {
        log('warn', 'createRoot should only be called once!');
    }
    else
    {
        state.app = new Application();
        state.rootContainer = prepareInstance(state.app.stage);
    }

    const fiber = root?.fiber ?? reconciler.createContainer(
        state.rootContainer,
        ConcurrentRoot,
        null,
        false,
        null,
        '',
        console.error,
        null,
    );

    if (!root)
    {
        let canvas;

        if (target instanceof HTMLCanvasElement)
        {
            canvas = target;
        }

        if (!canvas)
        {
            canvas = document.createElement('canvas');
            target.innerHTML = '';
            target.appendChild(canvas);
        }

        /**
         * @param {import('react').ReactNode} children
         * @param {ApplicationOptions} applicationOptions
         * @returns {Promise<Application>}
         */
        const render = async (children, applicationOptions) =>
        {
            if (!state.app.renderer && !state.isInitialising)
            {
                state.isInitialising = true;
                await state.app.init({
                    ...applicationOptions,
                    canvas,
                });
                onInit?.(state.app);
                state.isInitialising = false;
            }

            Object.entries(applicationOptions).forEach(([key, value]) =>
            {
                const typedKey = /** @type {keyof ApplicationOptions} */ (key);

                if (isReadOnlyProperty(applicationOptions, typedKey))
                {
                    return;
                }

                // @ts-expect-error Typescript doesn't realise it, but we're already verifying that this isn't a readonly key.
                state.app[typedKey] = value;
            });

            // Update fiber and expose Pixi.js state to children
            reconciler.updateContainer(
                createElement(ContextProvider, { value: state }, children),
                fiber,
                null,
                () => undefined
            );

            return state.app;
        };

        root = {
            fiber,
            render,
            state,
        };

        roots.set(canvas, root);
    }

    return root;
}
