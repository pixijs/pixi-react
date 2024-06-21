/**
 * @template {new (...args: any[]) => any} T
 * @typedef {T extends new (...args: infer A) => any ? A[0] : never} ConstructorParams
 */
export const ConstructorParams = {};
