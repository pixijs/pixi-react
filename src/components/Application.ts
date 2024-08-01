import { TextStyle } from 'pixi.js';
import {
    createElement,
    forwardRef,
    useCallback,
    useRef,
} from 'react';
import { createRoot } from '../core/createRoot';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

import type { Application as PixiApplication } from 'pixi.js';
import type {
    ForwardRefRenderFunction,
    MutableRefObject,
} from 'react';
import type { ApplicationProps } from '../typedefs/ApplicationProps';
import type { Root } from '../typedefs/Root';

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
        onInit,
        resizeTo,
        ...applicationProps
    } = props;

    const applicationRef: MutableRefObject<PixiApplication | null> = useRef(null);
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const rootRef: MutableRefObject<Root | null> = useRef(null);

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
        const canvasElement = canvasRef.current;

        if (canvasElement)
        {
            if (!rootRef.current)
            {
                rootRef.current = createRoot(canvasElement, {}, handleInit);
            }

            rootRef.current.render(children, applicationProps);
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

    return createElement('canvas', {
        ref: canvasRef,
        className,
    });
};

ApplicationFunction.displayName = 'Application';

export const Application = forwardRef(ApplicationFunction);
