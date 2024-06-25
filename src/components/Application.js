import {
    createElement,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { render } from '../render.js';

/** @typedef {import('pixi.js').Application} PixiApplication */
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

/**
 * @template T
 * @typedef {T extends undefined ? never : Omit<T, 'resizeTo'>} OmitResizeTo
 */

/**
 * @typedef {object} BaseApplicationProps
 * @property {string} [className] CSS classes to be applied to the Pixi Application's canvas element.
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
        children,
        className,
        resizeTo,
        ...applicationProps
    } = props;

    /** @type {MutableRefObject<PixiApplication | null>} */
    const applicationRef = useRef(null);

    /** @type {RefObject<HTMLCanvasElement>} */
    const canvasRef = useRef(null);

    useImperativeHandle(forwardedRef, () => /** @type {PixiApplication} */ /** @type {*} */ (applicationRef.current));

    useEffect(() =>
    {
        const canvasElement = canvasRef.current;

        if (canvasElement)
        {
            /** @type {ApplicationProps} */
            const parsedApplicationProps = {
                ...applicationProps,
            };

            if (resizeTo)
            {
                if ('current' in resizeTo)
                {
                    if (resizeTo.current instanceof HTMLElement)
                    {
                        parsedApplicationProps.resizeTo = resizeTo.current;
                    }
                }
                else
                {
                    (
                        parsedApplicationProps.resizeTo = resizeTo
                    );
                }
            }

            applicationRef.current = render(children, canvasElement, parsedApplicationProps);
        }
    }, [
        applicationProps,
        children,
        resizeTo,
    ]);

    return createElement('canvas', {
        ref: canvasRef,
        className,
    });
};

ApplicationFunction.displayName = 'Application';

export const Application = forwardRef(ApplicationFunction);
