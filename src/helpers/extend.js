import { catalogue } from './catalogue.js';

/** @typedef {import('../typedefs/AutoFilteredKeys.ts').AutoFilteredKeys} AutoFilteredKeys */

/**
 * Expose Pixi.js components for use in JSX.
 *
 * @param {{ [key: string]: new (...args: any) => any }} objects Components to be exposed.
 */
export function extend(objects)
{
    Object.assign(catalogue, objects);
}
