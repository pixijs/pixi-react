import {
    createElement,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { render } from '../render.js';

/** @typedef {import('pixi.js').Application} PixiApplication */
/** @typedef {import('pixi.js').ApplicationOptions} PixiApplicationOptions */
/**
 * @template T
 * @typedef {import('react').PropsWithChildren<T>} PropsWithChildren
 */
/**
 * @template T
 * @typedef {import('react').PropsWithRef<T>} PropsWithRef
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
 * @typedef {object} BaseApplicationProps
 * @property {string} [className] CSS classes to be applied to the Pixi Application's canvas element.
 */

/** @typedef {PropsWithChildren<OmitChildren<Partial<PixiApplicationOptions>>>} ApplicationPropsWithChildren */
/** @typedef {PropsWithRef<{ ref?: RefObject<PixiApplication> }>} ApplicationPropsWithRef */
/** @typedef {BaseApplicationProps & ApplicationPropsWithChildren} ApplicationProps */

/**
 * Creates a React root and renders a Pixi application.
 *
 * @type {import('react').ForwardRefRenderFunction<PixiApplication, ApplicationProps>}
 */
export const ApplicationFunction = (props, forwardedRef) =>
{
    const {
        children,
        className,
        ...applicationProps
    } = props;

    /** @type {RefObject<HTMLCanvasElement>} */
    const canvasRef = useRef(null);

    const [application, setApplication] = /** @type {PixiApplication} */ useState();

    useImperativeHandle(forwardedRef, () => /** @type {PixiApplication} */ /** @type {*} */ (application));

    useEffect(() =>
    {
        const canvasElement = canvasRef.current;

        if (canvasElement)
        {
            setApplication(render(children, canvasElement, applicationProps));
        }
    }, [
        applicationProps,
        children,
    ]);

    return createElement('canvas', {
        ref: canvasRef,
        className,
    });
};

ApplicationFunction.displayName = 'Application';

export const Application = forwardRef(ApplicationFunction);
