/**
 * @template T
 * @template {keyof T} K
 * @typedef {Omit<T, K> & Partial<Pick<T, K>>} PartialBy
 * @see https://stackoverflow.com/a/54178819
 */
export const PartialBy = {};
