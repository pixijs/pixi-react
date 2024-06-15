/** @typedef {import('./Instance.js').Instance} Instance */
/** @typedef {import('../typedefs/PixiElements.js').PixiElements} PixiElements */

/**
 * @typedef {object} HostConfig
 * @property {keyof PixiElements} type
 * @property {Record<string, unknown>} props
 * @property {Instance} container
 * @property {Instance} instance
 * @property {Instance} textInstance
 * @property {Instance} suspenseInstance
 * @property {never} hydratableInstance
 * @property {Instance} publicInstance
 * @property {null} hostContext
 * @property {object} updatePayload
 * @property {never} childSet
 * @property {number} timeoutHandle
 * @property {-1} noTimeout
 */
export {};
