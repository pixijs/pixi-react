/** @typedef {typeof import('pixi.js')} PixiType */

/**
 * @typedef {{
 *  [K in keyof PixiType]: PixiType[K] extends new (...args: any) => any ? K : never
 * }[keyof PixiType]} AutoFilteredKeys
 */
export const AutoFilteredKeys = {};
