import TYPES from '@pixi/react-tag-types';

import invariant from '../utils/invariant';
import { applyDefaultProps } from './props';
import * as components from '../components';

const ELEMENTS = Object.keys(TYPES).reduce((elements, type) => ({ ...elements, [type]: components[type] }), {});

/**
 * Inject types
 *
 * @type {Object}
 */
export const TYPES_INJECTED = {};

/**
 * Create an element based on tag type
 * Similar to react-dom's `React.createElement()`
 *
 * @param {string} type Element type
 * @param {Object} props Component props
 * @param {Object} root Root instance
 */
export function createElement(type, props = {}, root = null)
{
    const fn = ELEMENTS[type];

    let instance;
    let applyProps;

    if (typeof fn === 'function')
    {
        instance = fn(root, props);
    }

    if (!instance)
    {
    // not found, is there any injected custom component?
        const injected = TYPES_INJECTED[type];

        if (injected)
        {
            instance = injected.create(props);
            instance.didMount = injected.didMount ? injected.didMount.bind(instance) : undefined;
            instance.willUnmount = injected.willUnmount ? injected.willUnmount.bind(instance) : undefined;
            instance.applyProps = injected.applyProps ? injected.applyProps.bind(instance) : undefined;
            instance.config = injected.config;
        }
    }

    // apply initial props!
    if (instance)
    {
        applyProps = typeof instance?.applyProps === 'function' ? instance.applyProps : applyDefaultProps;
        applyProps(instance, {}, props);

        instance.__reactpixi = {
            root,
        };
    }

    return instance;
}

/**
 * Create Component
 *
 * @param {string} type
 * @param {Object} lifecycle methods
 */
export function PixiComponent(type, lifecycle)
{
    invariant(!!type, 'Expect type to be defined, got `%s`', type);
    invariant(!TYPES[type], 'Component `%s` could not be created, already exists in default components.', type);

    TYPES_INJECTED[type] = lifecycle;

    return type;
}
