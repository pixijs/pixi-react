/** @typedef {import('./ContainerElement.js').ContainerElement} ContainerElement */
/** @typedef {import('./EventHandlers.js').EventHandlers} EventHandlers */
/** @typedef {import('./InstanceState.js').InstanceState} InstanceState */

/**
 * @typedef {object} BaseInstance
 * @property {InstanceState} [__pixireact]
 * @property {boolean} [autoRemovedBeforeAppend]
 * @property {ContainerElement | ContainerElement[]} [children]
 * @property {(...args: any[]) => any} [draw]
 */

/** @typedef {ContainerElement & BaseInstance} Instance */
export {};
