/** @typedef {import('../typedefs/ContainerElement.js').ContainerElement} ContainerElement */
/** @typedef {import('../typedefs/Instance.js').Instance} Instance */
/** @typedef {import('../typedefs/InstanceState.js').InstanceState} InstanceState */

/**
 * Create the instance with the provided sate and attach the component to it.
 *
 * @template {ContainerElement} T
 * @param {T} component
 * @param {Partial<InstanceState>} [state]
 */
export function prepareInstance(component, state = {})
{
    /** @type {Instance} */
    const instance = /** @type {*} */ (component);

    instance.__pixireact = {
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
