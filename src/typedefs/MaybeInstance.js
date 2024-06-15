/** @typedef {import('./Instance.js').Instance} Instance */
/** @typedef {import('./InstanceState.js').InstanceState} InstanceState */
/**
 * @template T
 * @template {keyof T} K
 * @typedef {import('./PartialBy.js').PartialBy<T, K>} PartialBy
 */

/** @typedef {PartialBy<Instance, '__pixireact'>} MaybeInstance */
export {};
