import {
    createElement,
    useEffect,
    useRef,
} from 'react';
import { render } from '../render.js';

/** @typedef {import('pixi.js').Application} Application */
/** @typedef {import('pixi.js').ApplicationOptions} ApplicationOptions */
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

/** @typedef {PropsWithChildren<Partial<OmitChildren<ApplicationOptions>>>} ApplicationPropsWithChildren */
/** @typedef {PropsWithRef<{ ref?: RefObject<Application> }>} ApplicationPropsWithRef */
/** @typedef {BaseApplicationProps & ApplicationPropsWithChildren & ApplicationPropsWithRef} ApplicationProps */

/**
 * Creates a React root and renders a Pixi application.
 *
 * @param {ApplicationProps} props All props.
 */
export function Application(props)
{
    const {
        children,
        className,
        ...applicationProps
    } = props;

    /** @type {RefObject<HTMLCanvasElement>} */
    const canvasRef = useRef(null);

    useEffect(() =>
    {
        const canvasElement = canvasRef.current;

        if (canvasElement)
        {
            render(children, canvasElement, applicationProps);
        }
    }, []);

    return createElement('canvas', {
        ref: canvasRef,
        className,
    });
}
