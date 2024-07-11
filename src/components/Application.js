import {
    Application as PixiApplication,
    TextStyle,
} from 'pixi.js';
import {
    createElement,
    forwardRef,
    useCallback,
    useRef,
} from 'react';
import { createRoot } from '../core/createRoot.ts';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect.js';

/**
 * @template T
 * @typedef {import('react').MutableRefObject<T>} MutableRefObject
 */

/** @typedef {import('../typedefs/ApplicationProps.ts').ApplicationProps} ApplicationProps */
/** @typedef {import('../typedefs/Root.ts').Root} Root */

const originalDefaultTextStyle = { ...TextStyle.defaultTextStyle };

/**
 * Creates a React root and renders a Pixi application.
 *
 * @type {import('react').ForwardRefRenderFunction<PixiApplication, ApplicationProps>}
 */
export const ApplicationFunction = (props, forwardedRef) =>
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

    /** @type {MutableRefObject<PixiApplication | null>} */
    const applicationRef = useRef(null);

    /** @type {MutableRefObject<HTMLCanvasElement | null>} */
    const canvasRef = useRef(null);

    /** @type {MutableRefObject<Root | null>} */
    const rootRef = useRef(null);

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

    /** @type {(app: PixiApplication) => void} */
    const handleInit = useCallback((application) =>
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
            const globalScope = /** @type {*} */ (globalThis);

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
        /** @type {HTMLCanvasElement} */
        const canvasElement = /** @type {*} */ (canvasRef.current);

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
