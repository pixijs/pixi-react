/** @typedef {typeof import('pixi.js')} PixiType */

/**
 * @typedef {{
 *      [K in keyof PixiType]: K extends import('./TargetKeys.js').TargetKeys
 *          ? PixiType[K] extends new (...args: any) => any
 *          ? K
 *              : never
 *          : never;
 * }[keyof PixiType]} AutoFilteredKeys
 */
export const AutoFilteredKeys = {};
