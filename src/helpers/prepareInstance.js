/** @typedef {import('pixi.js').Container} Container */
/** @typedef {import('../typedefs/ContainerElement.ts').ContainerElement} ContainerElement */
/** @typedef {import('../typedefs/Instance.ts').Instance} Instance */
/** @typedef {import('../typedefs/InstanceState.ts').InstanceState} InstanceState */

/**
 * Create the instance with the provided sate and attach the component to it.
 *
 * @template {Container | ContainerElement} T
 * @param {T} component
 * @param {Partial<InstanceState>} [state]
 */
export function prepareInstance(component, state = {})
{
    /** @type {Instance} */
    const instance = /** @type {*} */ (component);

    instance.__pixireact = {
        parent: null,
        /** @type {Instance} */
        root: /** @type {*} */ (null),
        type: '',
        ...state,
    };

    return instance;
}
