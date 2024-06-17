/** @typedef {import('pixi.js').FederatedPointerEvent} FederatedPointerEvent */
/** @typedef {import('pixi.js').FederatedWheelEvent} FederatedWheelEvent */
/** @typedef {import('pixi.js').Graphics} Graphics */

/** @typedef {import('./ContainerElement.js').ContainerElement} ContainerElement */
/** @typedef {import('../constants/EventPropNames.js').EventPropNames} EventPropNames */
/** @typedef {import('./InstanceProps.js').InstanceProps} InstanceProps */
/** @typedef {import('./InstanceState.js').InstanceState} InstanceState */

/**
 * @typedef {object} BaseInstance
 * @property {InstanceState} [__pixireact]
 * @property {boolean} [autoRemovedBeforeAppend]
 * @property {ContainerElement | ContainerElement[]} [children]
 * @property {(graphics: Graphics) => void} [draw]
 */

/**
 * @typedef {{
 * 	[K in EventPropNames]?: (event: FederatedPointerEvent | FederatedWheelEvent) => void
 * }} EventHandlers
 */

/** @typedef {ContainerElement & BaseInstance & EventHandlers} Instance */

export const Instance = {};
