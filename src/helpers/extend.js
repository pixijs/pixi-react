import { catalogue } from './catalogue.js';

/**
 * Expose Pixi.js components for use in JSX.
 *
 * @param {import('../typedefs/PixiElementsImpl.js').PixiElementsImpl} objects The Pixi.js components to be exposed.
 */
export function extend(objects)
{
    Object.assign(catalogue, objects);
}
