/** @typedef {typeof import('pixi.js')} PixiType */

/**
 * @typedef {{
*  [K in keyof PixiType]: K extends `${string}Options` ? (PixiType)[K] : never
* }[keyof PixiType]} PixiOptions
*/
export const PixiOptions = {};
