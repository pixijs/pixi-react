import { Application as PixiApplication } from 'pixi.js';
import {
    createElement,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from 'react';
import { createRoot } from '../core/createRoot.js';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect.js';

/** @typedef {import('pixi.js').ApplicationOptions} PixiApplicationOptions */
/**
 * @template T
 * @typedef {import('react').MutableRefObject<T>} MutableRefObject
 */
/**
 * @template T
 * @typedef {import('react').PropsWithChildren<T>} PropsWithChildren
 */
/**
 * @template T
 * @typedef {import('react').RefObject<T>} RefObject
 */

/**
 * @template T
 * @typedef {import('../typedefs/OmitChildren.js').OmitChildren<T>} OmitChildren
 */

/** @typedef {import('../typedefs/Root.js').Root} Root */

/**
 * @template T
 * @typedef {T extends undefined ? never : Omit<T, 'resizeTo'>} OmitResizeTo
 */

/**
 * @typedef {object} BaseApplicationProps
 * @property {boolean} [attachToDevTools] Whether this application chould be attached to the dev tools. NOTE: This should only be enabled on one application at a time.
 * @property {string} [className] CSS classes to be applied to the Pixi Application's canvas element.
 * @property {(app: PixiApplication) => void} [onInit] Callback to be fired when the application finishes initializing.
 */

/** @typedef {{ resizeTo?: HTMLElement | Window | RefObject<HTMLElement> }} ResizeToProp */

/** @typedef {PropsWithChildren<OmitChildren<Partial<PixiApplicationOptions>>>} ApplicationPropsWithChildren */
/** @typedef {BaseApplicationProps & ApplicationPropsWithChildren} ApplicationProps */
/** @typedef {BaseApplicationProps & OmitResizeTo<ApplicationPropsWithChildren> & ResizeToProp} ApplicationPropsWithResizeToRef */

/**
 * Creates a React root and renders a Pixi application.
 *
 * @type {import('react').ForwardRefRenderFunction<PixiApplication, ApplicationPropsWithResizeToRef>}
 */
export const ApplicationFunction = (props, forwardedRef) =>
{
    const {
        attachToDevTools,
        children,
        className,
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

    useImperativeHandle(forwardedRef, () =>
    {
        /** @type {PixiApplication} */
        const typedApplication = /** @type {*} */ (applicationRef.current);

        return typedApplication;
    });

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
                delete application.resizeTo;
            }
        }
    }, [resizeTo]);

    /** @type {(app: PixiApplication) => void} */
    const handleInit = useCallback((application) =>
    {
        applicationRef.current = application;
        updateResizeTo();
        onInit?.(application);
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
        const application = applicationRef.current;

        if (attachToDevTools && application)
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
    }, [attachToDevTools]);

    return createElement('canvas', {
        ref: canvasRef,
        className,
    });
};

ApplicationFunction.displayName = 'Application';

export const Application = forwardRef(ApplicationFunction);
