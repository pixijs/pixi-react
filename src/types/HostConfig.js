/** @typedef {import('./HostContainer.js').HostContainer} HostContainer */
/** @typedef {import('./Node.js').Node} Node */

/**
 * @typedef {object} HostConfig
 * @property {string} type
 * @property {Record<string, unknown>} props
 * @property {HostContainer} container
 * @property {Node} instance
 * @property {Node} textInstance
 * @property {Node} suspenseInstance
 * @property {never} hydratableInstance
 * @property {null} publicInstance
 * @property {null} hostContext
 * @property {object} updatePayload
 * @property {never} childSet
 * @property {number} timeoutHandle
 * @property {-1} noTimeout
 */
export const HostConfig = {};
