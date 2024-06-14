import { NameOverrides } from './NameOverrides.js';

/** @typedef {typeof import('pixi.js')} PixiType */

/** @typedef {import('./AutoFilteredKeys.js').AutoFilteredKeys} AutoFilteredKeys */
/** @typedef {import('./PixiElements.js').PixiElements} PixiElements */
/** @typedef {import('./PixiOptions.js').PixiOptions} PixiOptions */

/**
 * @template {T extends PixiOptions ? T : never} T
 * @typedef {T} PixiOptionsType
 */

/**
 * @typedef {{
 *  [K in AutoFilteredKeys as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]:
 *      import('react').PropsWithChildren<
 *          PixiOptionsType<import('./ConstructorParams.js').ConstructorParams<PixiType[K]>>
 *          & { init?: import('./ConstructorParams.js').ConstructorParams<PixiType[K]> }
 *      > & import('react').PropsWithRef<{ ref?: import('react').MutableRefObject<InstanceType<PixiType[K]>> }>
 * }} PixiElementsImpl
 */
export const PixiElementsImpl = {};
