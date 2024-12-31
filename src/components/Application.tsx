import {
    FiberProvider,
    useContextBridge,
} from 'its-fine'
import {
    type Application as PixiApplication,
    extensions as PixiExtensions,
    TextStyle,
} from 'pixi.js';
import {
    forwardRef,
    type RefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { createRoot } from '../core/createRoot';
import { roots } from '../core/roots';
import { processUnmountQueue } from '../helpers/processUnmountQueue';
import { queueForUnmount } from '../helpers/queueForUnmount';
import { unqueueForUnmount } from '../helpers/unqueueForUnmount';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { type ApplicationProps } from '../typedefs/ApplicationProps';
import { type ApplicationRef } from '../typedefs/ApplicationRef';

const originalDefaultTextStyle = { ...TextStyle.defaultTextStyle };

const ApplicationImplementation = forwardRef<ApplicationRef, ApplicationProps>(function Application(
    props,
    forwardedRef,
)
{
    const {
        children,
        className,
        defaultTextStyle,
        extensions,
        onInit,
        resizeTo,
        ...applicationProps
    } = props;

    const Bridge = useContextBridge();

    const applicationRef: RefObject<PixiApplication | null> = useRef(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const extensionsRef = useRef<Set<any>>(new Set());

    useImperativeHandle(forwardedRef, () => ({
        getApplication()
        {
            return applicationRef.current;
        },
        getCanvas()
        {
            return canvasRef.current;
        },
    }));

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

        applicationRef.current = application;
        updateResizeTo();
        onInit?.(application);
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

            // @ts-expect-error The value of `children` is fine, but `PixiReactChildNode` doesn't strictly adhere to the `ReactNode` structure.
            root.render((<Bridge>{children}</Bridge>), applicationProps);
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

    return (
        <canvas
            ref={canvasRef}
            className={className} />
    );
});

export const Application = forwardRef<ApplicationRef, ApplicationProps>(function ApplicationWrapper(props, ref)
{
    return (
        <FiberProvider>
            <ApplicationImplementation
                ref={ref}
                {...props} />
        </FiberProvider>
    );
});
