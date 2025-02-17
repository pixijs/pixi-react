import { Application } from 'pixi.js';
import { type ApplicationOptions } from 'pixi.js';
import { type ReactNode } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants';
import { ContextProvider } from '../components/Context';
import { isReadOnlyProperty } from '../helpers/isReadOnlyProperty';
import { log } from '../helpers/log';
import { prepareInstance } from '../helpers/prepareInstance';
import { type ApplicationState } from '../typedefs/ApplicationState';
import { type CreateRootOptions } from '../typedefs/CreateRootOptions';
import { type HostConfig } from '../typedefs/HostConfig';
import { type InternalState } from '../typedefs/InternalState';
import { reconciler } from './reconciler';
import { roots } from './roots';

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

    const fiber = root?.fiber ?? (reconciler as any).createContainer(
        internalState.rootContainer, // container
        ConcurrentRoot, // tag
        null, // hydration callbacks
        false, // isStrictMode
        null, // concurrentUpdatesByDefaultOverride
        '', // identifierPrefix
        console.error, // onUncaughtError
        console.error, // onCaughtError
        console.error, // onRecoverableError
        null, // transitionCallbacks
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

        internalState.canvas = canvas;

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
                const typedKey = key as keyof ApplicationOptions;

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
                (
                    <ContextProvider value={applicationState}>
                        {children}
                    </ContextProvider>
                ),
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
