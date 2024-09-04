import {
    type Application as PixiApplication,
    extensions as PixiExtensions,
    TextStyle,
} from 'pixi.js';
import {
    createElement,
    forwardRef,
    type ForwardRefRenderFunction,
    type MutableRefObject,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { createRoot } from '../core/createRoot';
import { roots } from '../core/roots';
import { processUnmountQueue } from '../helpers/processUnmountQueue';
import { queueForUnmount } from '../helpers/queueForUnmount';
import { unqueueForUnmount } from '../helpers/unqueueForUnmount';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { type ApplicationProps } from '../typedefs/ApplicationProps';

const originalDefaultTextStyle = { ...TextStyle.defaultTextStyle };

/** Creates a React root and renders a Pixi application. */
export const ApplicationFunction: ForwardRefRenderFunction<PixiApplication, ApplicationProps> = (
    props,
    forwardedRef,
) =>
{
    const {
        attachToDevTools,
        children,
        className,
        defaultTextStyle,
        extensions,
        onInit,
        resizeTo,
        ...applicationProps
    } = props;

    const applicationRef: MutableRefObject<PixiApplication | null> = useRef(null);
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const extensionsRef: MutableRefObject<Set<any>> = useRef(new Set());

    const updateResizeTo = useCallback(() =>
    {
        const application = applicationRef.current;

        if (application)
        {
            if (resizeTo)
            {
                if ('current' in resizeTo)
                {
                    if (resizeTo.current instanceof HTMLElement)
                    {
                        application.resizeTo = resizeTo.current;
                    }
                }
                else
                {
                    application.resizeTo = resizeTo;
                }
            }
            else
            {
                // @ts-expect-error Actually `resizeTo` is optional, the types are just wrong. 🤷🏻‍♂️
                application.resizeTo = undefined;
            }
        }
    }, [resizeTo]);

    const handleInit = useCallback((application: PixiApplication) =>
    {
        processUnmountQueue();

        if (forwardedRef && ('current' in forwardedRef))
        {
            forwardedRef.current = application;
        }

        applicationRef.current = application;
        updateResizeTo();
        onInit?.(application);

        if (attachToDevTools)
        {
            const globalScope = globalThis as any;

            globalScope.__PIXI_APP__ = application;

            import('pixi.js').then((pixi) =>
            {
                globalScope.__PIXI_DEVTOOLS__ = {
                    app: application,
                    pixi,
                    renderer: application.renderer,
                    stage: application.stage,
                };
            });
        }
    }, [onInit]);

    useIsomorphicLayoutEffect(() =>
    {
        if (extensions)
        {
            const extensionsToHandle = [...extensions];
            const extensionsState = extensionsRef.current;

            // Check for extensions that have been removed from the array
            for (const extension of extensionsState.values())
            {
                const extensionIndex = extensionsToHandle.indexOf(extension);

                // If the extension is no longer in the array, we'll remove it from Pixi.js
                if (extensionIndex === -1)
                {
                    PixiExtensions.remove(extension);
                    extensionsState.delete(extension);
                }

                // Since the extension already existed in the state, we can remove it to prevent any further handling
                extensionsToHandle.splice(extensionIndex, 1);
            }

            // Load any remaining extensions.
            for (const extension in extensionsToHandle)
            {
                PixiExtensions.add(extension);
                extensionsState.add(extension);
            }
        }
    }, [extensions]);

    useIsomorphicLayoutEffect(() =>
    {
        const canvasElement = canvasRef.current;

        if (canvasElement)
        {
            let root = roots.get(canvasElement);

            if (!root)
            {
                root = createRoot(canvasElement, {}, handleInit);
            }

            root.render(children, applicationProps);
        }
    }, [
        applicationProps,
        children,
        handleInit,
        resizeTo,
    ]);

    useIsomorphicLayoutEffect(() =>
    {
        updateResizeTo();
    }, [resizeTo]);

    useIsomorphicLayoutEffect(() =>
    {
        if (defaultTextStyle)
        {
            Object.assign(TextStyle.defaultTextStyle, defaultTextStyle);
        }
        else
        {
            Object.assign(TextStyle.defaultTextStyle, originalDefaultTextStyle);
        }
    }, [defaultTextStyle]);

    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        const canvasElement = canvasRef.current;

        if (canvasElement)
        {
            unqueueForUnmount(canvasElement);

            return () =>
            {
                queueForUnmount(canvasElement);
            };
        }
    }, []);

    return createElement('canvas', {
        className,
        ref: canvasRef,
    });
};

ApplicationFunction.displayName = 'Application';

export const Application = forwardRef(ApplicationFunction);
