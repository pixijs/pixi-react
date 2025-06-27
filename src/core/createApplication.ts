import { Application, type Container, type TickerCallback } from 'pixi.js';
import { createContext, createElement, type ReactNode, useContext } from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants';
import { invariant } from '../helpers/invariant';
import { prepareInstance } from '../helpers/prepareInstance';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { type ApplicationState } from '../typedefs/ApplicationState';
import { type HostConfig } from '../typedefs/HostConfig';
import { type UseTickOptions } from '../typedefs/UseTickOptions';
import { reconciler } from './reconciler';

/**
 * Interface for a root that can be mounted/unmounted
 */
export interface ApplicationRoot
{
    /** Unmount this root and clean up all resources */
    unmount(): void;
}

/**
 * Options for creating an application root
 */
export interface CreateApplicationRootOptions
{
    /** Called when the root is mounted */
    onMount?: () => void;
    /** Called when the root is unmounted */
    onUnmount?: () => void;
}

/**
 * Creates hooks and utilities for working with an existing Pixi Application
 */
export function createApplication(app: Application)
{
    // Create a dedicated context for this application instance
    const AppContext = createContext<ApplicationState>({} as ApplicationState);

    // Application state for this specific instance
    const applicationState: ApplicationState = {
        app,
        isInitialised: true, // Assume existing app is already initialized
        isInitialising: false,
    };

    /**
   * Hook to get the application instance
   */
    function useApp(): Application
    {
        const appContext = useContext(AppContext);

        invariant(
            appContext.app instanceof Application,
            'useApp must be used within a component rendered by createRoot from createApplication'
        );

        return appContext.app;
    }

    /**
   * Hook to attach a callback to the application's ticker
   */
    function useTick<T>(
        options: TickerCallback<T> | UseTickOptions<T>,
    )
    {
        const app = useApp();

        let callback: TickerCallback<T>;
        let context: any;
        let isEnabled: boolean = true;
        let priority: number | undefined;

        if (typeof options === 'function')
        {
            callback = options;
        }
        else
        {
            callback = options.callback;
            context = options.context;
            isEnabled = options.isEnabled ?? true;
            priority = options.priority;
        }

        useIsomorphicLayoutEffect(() =>
        {
            if (!isEnabled)
            {
                return undefined;
            }

            const ticker = app.ticker;

            if (context)
            {
                ticker.add(callback, context, priority);
            }
            else
            {
                ticker.add(callback as any, undefined, priority);
            }

            return () =>
            {
                if (context)
                {
                    ticker.remove(callback, context);
                }
                else
                {
                    ticker.remove(callback as any);
                }
            };
        }, [app, callback, context, isEnabled, priority]);
    }

    /**
   * Creates a new React root that renders into a Pixi container
   */
    function createRoot(
    /** The Pixi container to render into */
        container: Container,
        /** The React tree to render */
        children: ReactNode,
        /** Options for the root */
        options: CreateApplicationRootOptions = {}
    ): ApplicationRoot
    {
    // Prepare the container for React reconciler
        const hostContainer = prepareInstance(container) as HostConfig['containerInstance'];

        // Create fiber root
        const fiber = (reconciler as any).createContainer(
            hostContainer,
            ConcurrentRoot,
            null, // hydration callbacks
            false, // isStrictMode
            null, // concurrentUpdatesByDefaultOverride
            '', // identifierPrefix
            console.error, // onUncaughtError
            console.error, // onCaughtError
            console.error, // onRecoverableError
            null, // transitionCallbacks
        );

        let isMounted = false;

        const mount = () =>
        {
            if (isMounted) return;

            isMounted = true;

            // Render the tree with our custom context
            reconciler.updateContainer(
                createElement(AppContext.Provider, { value: applicationState }, children),
                fiber,
                null,
                () =>
                {
                    options.onMount?.();
                }
            );
        };

        const unmount = () =>
        {
            if (!isMounted) return;

            isMounted = false;

            // Clear the container
            reconciler.updateContainer(null, fiber, null, () =>
            {
                options.onUnmount?.();
            });
        };

        // Mount immediately since we're working with Pixi containers
        mount();

        return {
            unmount,
        };
    }

    return {
        useApp,
        useTick,
        createRoot,
    };
}
