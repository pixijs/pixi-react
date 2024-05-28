import { Graphics } from 'pixi.js';
import { pruneKeys } from './pruneKeys.js';

/**
 * Apply properties to Pixi.js instance.
 *
 * @param {{ [key: string]: any }} instance An instance?
 * @param {{ [key: string]: any }} newProps New props.
 * @param {{ [key: string]: any }} [oldProps] Old props.
 */
export function applyProps(instance, newProps, oldProps = {})
{
    // Filter identical props, event handlers, and reserved keys
    const identicalProps = Object
        .keys(newProps)
        .filter((key) => newProps[key] === oldProps[key]);

    if ((instance instanceof Graphics) && !identicalProps.includes('draw'))
    {
        newProps.draw?.(instance);
    }

    const handlers = Object.keys(newProps).filter((key) =>
    {
        const isFunction = typeof newProps[key] === 'function';

        return isFunction && key.startsWith('on');
    });

    const props = pruneKeys(newProps, [
        ...identicalProps,
        ...handlers,
        'children',
        'draw',
        'key',
        'ref',
    ]);

    // Mutate our Pixi.js element
    if (Object.keys(props).length)
    {
        Object.entries(props).forEach(([key, value]) =>
        {
            // const target = instance[key]
            // const isColor = target instanceof THREE.Color

            // // Prefer to use properties' copy and set methods
            // // otherwise, mutate the property directly
            // if (target?.set) {
            // 	if (target.constructor.name === value.constructor.name) {
            // 		target.copy(value)
            // 	} else if (Array.isArray(value)) {
            // 		target.set(...value)
            // 	} else if (!isColor && target?.setScalar) {
            // 		// Allow shorthand like scale={1}
            // 		target.setScalar(value)
            // 	} else {
            // 		target.set(value)
            // 	}

            // 	// Auto-convert sRGB colors
            // 	if (isColor) {
            // 		target.convertSRGBToLinear()
            // 	}
            // } else {
            // 	instance[key] = value
            // }
            instance[key] = value;
        });
    }

    // Collect event handlers.
    // We put this on an invalid prop so Pixi.js doesn't serialize handlers
    // if you do ref.current.clone() or ref.current.toJSON()
    if (handlers.length)
    {
        instance.__handlers = handlers.reduce(
            (acc, key) => ({
                ...acc,
                [key]: newProps[key],
            }),
            {},
        );
    }
}
