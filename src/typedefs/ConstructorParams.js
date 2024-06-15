/**
 * @template {new (...args: any[]) => any} T
 * @typedef {T extends new (args: infer A) => any ? A : never} ConstructorWithOneParam
 */

/**
 * @template {new (...args: any[]) => any} T
 * @typedef {ConstructorWithOneParam<T>} ConstructorParams
 */
export {};
