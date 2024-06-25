/** @typedef {import('./PixiElementsImpl.js').PixiElementsImpl} PixiElementsImpl */

/**
 * @typedef {{
 *  [K in keyof PixiElementsImpl as `pixi${Capitalize<K>}`]: PixiElementsImpl[K];
 * }} NamespacedPixiElementsImpl
 */
export const NamespacedPixiElementsImpl = {};
