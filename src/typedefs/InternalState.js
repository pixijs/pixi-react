/** @typedef {import('pixi.js').Application} Application */

/** @typedef {import('./Instance.js').Instance} Instance */

/**
 * @typedef {object} InternalState
 * @property {Application} app
 * @property {HTMLCanvasElement} [canvas]
 * @property {boolean} [debug]
 * @property {boolean} [isInitialising]
 * @property {Instance} rootContainer
 */
export const InternalState = {};
