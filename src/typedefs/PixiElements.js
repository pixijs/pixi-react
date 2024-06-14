/** @typedef {typeof import('pixi.js')} PixiType */
/** @typedef {import('react')} React */

/**
 * @typedef {{
 *  [K in import('./AutoFilteredKeys.js').AutoFilteredKeys]: [
 *      Uncapitalize<K>,
 *      React.PropsWithChildren<
 *      import('./ConstructorParams.js').ConstructorParams<PixiType[K]>
 *      & { init?: readonly any[] }
 *      > & React.PropsWithRef<{ ref?: React.MutableRefObject<InstanceType<PixiType[K]>> }>
 *  ];
 * }} PixiElements
 */
export const PixiElements = {};
