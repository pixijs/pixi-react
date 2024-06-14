/** @typedef {import('pixi.js').Container} Container */

/** @typedef {import('./EventHandlers.js').EventHandlers} EventHandlers */
/** @typedef {import('./InstanceState.js').InstanceState} InstanceState */

/**
 * @typedef {object} BaseInstance
 * @property {InstanceState} [__pixireact]
 */

/** @typedef {{ [key: string]: any } & Container & BaseInstance} Instance */

export const Instance = {};
