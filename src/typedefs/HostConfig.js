/** @typedef {import('./Instance.js').Instance} Instance */
/** @typedef {import('../typedefs/NamespacedPixiElementsImpl.js').NamespacedPixiElementsImpl} NamespacedPixiElementsImpl */
/** @typedef {import('../typedefs/PixiElementsImpl.js').PixiElementsImpl} PixiElementsImpl */

/**
 * @typedef {object} HostConfig
 * @property {keyof PixiElementsImpl | keyof NamespacedPixiElementsImpl} type
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
export const HostConfig = {};
