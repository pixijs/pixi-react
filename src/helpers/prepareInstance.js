/** @typedef {import('pixi.js').Container} Container */

/** @typedef {import('../typedefs/Instance.js').Instance} Instance */

/**
 * Create the instance with the provided sate and attach the component to it.
 *
 * @template {Container} T
 * @param {T} component
 * @param {Partial<Instance>} [state]
 */
export function prepareInstance(component, state = {})
{
    /** @type {Instance} */
    const instance = /** @type {*} */ (component);

    instance.__reactpixi = {
        children: undefined,
        eventCount: 0,
        handlers: {},
        parent: null,
        /** @type {Instance} */
        root: /** @type {*} */ (null),
        type: '',
        ...state,
    };

    return instance;
}
