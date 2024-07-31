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
import type { ApplicationState } from '../typedefs/ApplicationState.ts';
import type { CreateRootOptions } from '../typedefs/CreateRootOptions.ts';
import type { HostConfig } from '../typedefs/HostConfig.ts';
import type { InternalState } from '../typedefs/InternalState.ts';

/** Creates a new root for a Pixi React app. */
export function createRoot(
    /** @description The DOM node which will serve as the root for this tree. */
    target: HTMLElement | HTMLCanvasElement,

    /** @description Options to configure the tree. */
    options: CreateRootOptions = {},

    /**
     * @deprecated
     * @description Callback to be fired when the application finishes initializing.
     */
    onInit?: (app: Application) => void,
)
{
    // Check against mistaken use of createRoot
    let root = roots.get(target);
    let applicationState = (root?.applicationState ?? {
        isInitialised: false,
        isInitialising: false,
    }) as ApplicationState;

    const internalState = root?.internalState ?? {} as InternalState;

    if (root)
    {
        log('warn', 'createRoot should only be called once!');
    }
    else
    {
        applicationState.app = new Application();
        internalState.rootContainer = prepareInstance(applicationState.app.stage) as HostConfig['containerInstance'];
    }

    const fiber = root?.fiber ?? reconciler.createContainer(
        internalState.rootContainer,
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
            if (!applicationState.app.renderer && !applicationState.isInitialised && !applicationState.isInitialising)
            {
                applicationState.isInitialising = true;
                await applicationState.app.init({
                    ...applicationOptions,
                    canvas,
                });
                applicationState.isInitialising = false;
                applicationState.isInitialised = true;
                applicationState = { ...applicationState };
                (options.onInit ?? onInit)?.(applicationState.app);
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
                applicationState.app[typedKey] = value;
            });

            // Update fiber and expose Pixi.js state to children
            reconciler.updateContainer(
                createElement(ContextProvider, { value: applicationState }, children),
                fiber,
                null,
                () => undefined,
            );

            return applicationState.app;
        };

        root = {
            applicationState,
            fiber,
            internalState,
            render,
        };

        roots.set(canvas, root);
    }

    return root;
}
