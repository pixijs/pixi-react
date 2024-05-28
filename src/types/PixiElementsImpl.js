/** @typedef {import('./PixiElements.js').PixiElements} PixiElements */
/** @typedef {typeof import('pixi.js')} PixiType */

/**
 * @typedef {{
 *  [K in keyof PixiElements as PixiElements[K][0]]: PixiElements[K][1];
 * }} PixiElementsImpl
 */
export const PixiElementsImpl = {};
