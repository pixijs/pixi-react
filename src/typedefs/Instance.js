/** @typedef {import('pixi.js').Graphics} Graphics */

/** @typedef {import('./ContainerElement.js').ContainerElement} ContainerElement */
/** @typedef {import('./EventHandlers.js').EventHandlers} EventHandlers */
/** @typedef {import('./InstanceState.js').InstanceState} InstanceState */

/**
 * @typedef {object} BaseInstance
 * @property {InstanceState} [__pixireact]
 * @property {boolean} [autoRemovedBeforeAppend]
 * @property {ContainerElement | ContainerElement[]} [children]
 * @property {(graphics: Graphics) => void} [draw]
 */

/** @typedef {ContainerElement & BaseInstance & EventHandlers} Instance */

export const Instance = {};
