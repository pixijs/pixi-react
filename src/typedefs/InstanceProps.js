/** @typedef {import('pixi.js').Graphics} Graphics */

/** @typedef {import('./ContainerElement.js').ContainerElement} ContainerElement */
/** @typedef {import('./InstanceState.js').InstanceState} InstanceState */

/**
 * @typedef {object} BaseInstanceProps
 * @property {InstanceState} [__pixireact]
 * @property {boolean} [autoRemovedBeforeAppend]
 * @property {ContainerElement | ContainerElement[]} [children]
 * @property {(graphics: Graphics) => void} [draw]
 */

/** @typedef {{ [key: string]: unknown } & BaseInstanceProps} InstanceProps */
export const InstanceProps = {};
