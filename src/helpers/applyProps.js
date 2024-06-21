import {
    Container,
    Graphics,
} from 'pixi.js';
import {
    PixiToReactEventPropNames,
    ReactToPixiEventPropNames,
} from '../constants/EventPropNames.js';
import { diffProps } from './diffProps.js';
import { isDiffSet } from './isDiffSet.js';
import { log } from './log.js';

/** @typedef {import('pixi.js').FederatedPointerEvent} FederatedPointerEvent */
/** @typedef {import('pixi.js').FederatedWheelEvent} FederatedWheelEvent */

/** @typedef {import('../typedefs/DiffSet.js').DiffSet} DiffSet */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */
/** @typedef {import('../typedefs/InstanceProps.js').InstanceProps} InstanceProps */
/** @typedef {import('../typedefs/MaybeInstance.js').MaybeInstance} MaybeInstance */

const DEFAULT = '__default';
const DEFAULTS_CONTAINERS = new Map();

/** @type {Record<string, boolean>} */
const PIXI_EVENT_PROP_NAME_ERROR_HAS_BEEN_SHOWN = {};

/**
 * Apply properties to Pixi.js instance.
 *
 * @param {MaybeInstance} instance An instance?
 * @param {InstanceProps | DiffSet} data New props.
 */
export function applyProps(instance, data)
{
    const localState = instance.__pixireact;
    const {
        __pixireact,
        ...instanceProps
    } = instance;

    /** @type {DiffSet} */
    const { changes } = /** @type {*} */ (isDiffSet(data) ? data : diffProps(data, instanceProps));

    let changeIndex = 0;

    while (changeIndex < changes.length)
    {
        const change = changes[changeIndex];
        let hasError = false;
        let key = /** @type {keyof Instance} */ (change[0]);
        let value = change[1];
        const isEvent = change[2];

        /** @type {(keyof Instance)[]} */
        const keys = /** @type {*} */ (change[3]);

        let currentInstance = instance;
        let targetProp = currentInstance[key];

        if ((key === 'draw') && (typeof value === 'function'))
        {
            if (instance instanceof Graphics)
            {
                value(instance);
            }
            else
            {
                hasError = true;
                log('warn', `The \`draw\` prop was used on a \`${instance.type}\` component, but it's only valid on \`graphics\` components.`);
            }
        }

        if (key in PixiToReactEventPropNames)
        {
            const typedKey = /** @type {keyof PixiToReactEventPropNames} */ (key);

            hasError = true;

            if (!PIXI_EVENT_PROP_NAME_ERROR_HAS_BEEN_SHOWN[key])
            {
                PIXI_EVENT_PROP_NAME_ERROR_HAS_BEEN_SHOWN[key] = true;

                log('warn', `Event names must be pascal case; instead of \`${key}\`, you probably want \`${PixiToReactEventPropNames[typedKey]}\`.`);
            }
        }

        if (!hasError)
        {
            // Resolve dashed props
            if (keys.length)
            {
                targetProp = keys.reduce((accumulator, key) => accumulator[key], currentInstance);

                // If the target is atomic, it forces us to switch the root
                if (!(targetProp && targetProp.set))
                {
                    const [name, ...reverseEntries] = keys.reverse();

                    currentInstance = reverseEntries.reverse().reduce((accumulator, key) =>
                        accumulator[key], currentInstance);

                    key = name;
                }
            }

            // https://github.com/mrdoob/three.js/issues/21209
            // HMR/fast-refresh relies on the ability to cancel out props, but pixi.js
            // has no means to do this. Hence we curate a small collection of value-classes
            // with their respective constructor/set arguments
            // For removed props, try to set default values, if possible
            if (value === `${DEFAULT}remove`)
            {
                if (currentInstance instanceof Container)
                {
                    // create a blank slate of the instance and copy the particular parameter.
                    let ctor = DEFAULTS_CONTAINERS.get(currentInstance.constructor);

                    if (!ctor)
                    {
                        /** @type {Container} */
                        ctor = /** @type {*} */ (currentInstance.constructor);

                        // eslint-disable-next-line new-cap
                        ctor = new ctor();

                        DEFAULTS_CONTAINERS.set(currentInstance.constructor, ctor);
                    }

                    value = ctor[key];
                }
                else
                {
                    // instance does not have constructor, just set it to 0
                    value = 0;
                }
            }

            // Deal with events ...
            if (isEvent && localState)
            {
                const typedKey = /** @type {keyof ReactToPixiEventPropNames} */ (key);
                const pixiKey = ReactToPixiEventPropNames[typedKey];

                if (value)
                {
                    currentInstance[pixiKey] = /** @type {(event: FederatedPointerEvent | FederatedWheelEvent) => void} */ (value);
                }
                else
                {
                    delete currentInstance[pixiKey];
                }
            }
            else
            {
                const prototype = Object.getPrototypeOf(currentInstance);
                const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, key);

                if (typeof propertyDescriptor === 'undefined' || propertyDescriptor.set)
                {
                    // @ts-expect-error The key is cast to any property of Container, including read-only properties. The check above prevents us from setting read-only properties, but TS doesn't understand it. 🤷🏻‍♂️
                    currentInstance[key] = value;
                }
            }
        }

        changeIndex += 1;
    }

    return instance;
}
