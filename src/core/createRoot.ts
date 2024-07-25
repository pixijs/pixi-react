import { Application } from 'pixi.js';
import { createElement } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants.js';
import { ContextProvider } from '../components/Context.ts';
import { isReadOnlyProperty } from '../helpers/isReadOnlyProperty.ts';
import { log } from '../helpers/log.ts';
import { prepareInstance } from '../helpers/prepareInstance.ts';
import { reconciler } from './reconciler.ts';
import { roots } from './roots.ts';

import type { ApplicationOptions } from 'pixi.js';
import type { ReactNode } from 'react';
import type { HostConfig } from '../typedefs/HostConfig.ts';
import type { InternalState } from '../typedefs/InternalState.ts';

/** Creates a new root for a Pixi React app. */
export function createRoot(
    target: HTMLElement | HTMLCanvasElement,
    options: Partial<InternalState> = {},
    onInit?: (app: Application) => void,
)
{
    // Check against mistaken use of createRoot
    let root = roots.get(target);

    const state = Object.assign((root?.state ?? {}), options) as InternalState;

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
        state.rootContainer as HostConfig['containerInstance'],
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

        const render = async (
            children: ReactNode,
            applicationOptions: ApplicationOptions,
        ) =>
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

                if (isReadOnlyProperty(
                    applicationOptions as unknown as Record<string, unknown>,
                    typedKey,
                ))
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
