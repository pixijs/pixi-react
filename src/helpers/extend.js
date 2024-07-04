import { catalogue } from './catalogue.js';

/** @typedef {import('../typedefs/AutoFilteredKeys.ts').AutoFilteredKeys} AutoFilteredKeys */

/**
 * Expose Pixi.js components for use in JSX.
 *
 * @param {{
 *  [K in AutoFilteredKeys]?: typeof import('pixi.js')[K]
 * }} objects The Pixi.js components to be exposed.
 */
export function extend(objects)
{
    Object.assign(catalogue, objects);
}
