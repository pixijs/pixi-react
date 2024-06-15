/** @typedef {import('./EventHandlers.js').EventHandlers} EventHandlers */
/** @typedef {import('./Instance.js').Instance} Instance */

/**
 * @typedef {object} InstanceState
 * @property {boolean} [autoRemovedBeforeAppend]
 * @property {number} eventCount
 * @property {Partial<EventHandlers>} handlers
 * @property {null | Instance} parent
 * @property {Instance} root
 * @property {string} type
 */
export {};
