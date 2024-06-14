import {
    Container,
    Graphics,
} from 'pixi.js';
import { diffProps } from './diffProps.js';
import { isDiffSet } from './isDiffSet.js';
// import { pruneKeys } from './pruneKeys.js';

/** @typedef {import('../typedefs/DiffSet.js').DiffSet} DiffSet */
/** @typedef {import('../typedefs/EventHandlers.js').EventHandlers} EventHandlers */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */
/** @typedef {import('../typedefs/InstanceProps.js').InstanceProps} InstanceProps */
/** @typedef {import('../typedefs/MaybeInstance.js').MaybeInstance} MaybeInstance */

const DEFAULT = '__default';
const DEFAULTS_CONTAINERS = new Map();

/**
 * Apply properties to Pixi.js instance.
 *
 * @param {MaybeInstance} instance An instance?
 * @param {InstanceProps | DiffSet} data New props.
 */
export function applyProps(instance, data)
{
    const localState = instance.__reactpixi;
    const {
        __reactpixi,
        ...instanceProps
    } = instance;

    /** @type {DiffSet} */
    const { changes } = /** @type {*} */ (isDiffSet(data) ? data : diffProps(data, instanceProps));

    let changeIndex = 0;

    while (changeIndex < changes.length)
    {
        const change = changes[changeIndex];

        let key = change[0];
        let value = change[1];
        const isEvent = change[2];
        const keys = change[3];

        /** @type {Instance} */
        let currentInstance = /** @type {*} */ (instance);
        let targetProp = currentInstance[key];

        if ((instance instanceof Graphics) && (key === 'draw') && (value instanceof Function))
        {
            value(instance);
        }

        // Resolve dashed props
        if (keys.length)
        {
            targetProp = keys.reduce((accumulator, key) =>
                accumulator[key], currentInstance);

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
        // HMR/fast-refresh relies on the ability to cancel out props, but threejs
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

        // Deal with pointer events ...
        if (isEvent && localState)
        {
            /** @type {keyof EventHandlers} */
            const typedKey = /** @type {*} */ (key);

            if (value)
            {
                localState.handlers[typedKey] = /** @type {*} */ (value);
            }
            else
            {
                delete localState.handlers[typedKey];
            }

            localState.eventCount = Object.keys(localState.handlers).length;
        }
        else
        {
            currentInstance[key] = value;
        }

        changeIndex += 1;
    }

    return instance;
}
