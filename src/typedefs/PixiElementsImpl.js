import { NameOverrides } from '../constants/NameOverrides.js';

/** @typedef {typeof import('pixi.js')} PixiType */
/** @typedef {import('pixi.js').Graphics} Graphics */
/**
 * @template T
 * @typedef {import('react').PropsWithChildren<T>} PropsWithChildren
 */
/**
 * @template T
 * @typedef {import('react').PropsWithRef<T>} PropsWithRef
 */
/**
 * @template T
 * @typedef {import('react').RefObject<T>} RefObject
 */

/** @typedef {import('./AutoFilteredKeys.js').AutoFilteredKeys} AutoFilteredKeys */
/** @typedef {import('./EventHandlers.js').EventHandlers} EventHandlers */
/** @typedef {import('./PixiOptions.js').PixiOptions} PixiOptions */

/**
 * @template {new (...args: any[]) => any} T
 * @typedef {import('./ConstructorParams.js').ConstructorParams<T>} ConstructorParams
 */

/**
 * @template T
 * @typedef {{
 *  [K in keyof T]: T[K] extends (...args: any) => any ? never : T[K]
 * }} PixiOptionsType
 */

/**
 * @template T
 * @typedef {T extends undefined ? never : Omit<T, 'children'>} OmitChildren
 */

/** @typedef {{ draw?: (graphics: Graphics) => void }} DrawCallback */

/**
 * @typedef {{
 *  [K in AutoFilteredKeys as K extends keyof typeof NameOverrides ? typeof NameOverrides[K] : Uncapitalize<K>]:
 *      & PropsWithChildren<OmitChildren<PixiOptionsType<ConstructorParams<PixiType[K]>>>>
 *      & PropsWithRef<{ ref?: RefObject<InstanceType<PixiType[K]>> }>
 *      & EventHandlers
 *      & DrawCallback
 * }} PixiElementsImpl
 */
export const PixiElementsImpl = {};
